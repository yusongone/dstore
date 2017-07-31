import React from "react"
import ReactDOM from "react-dom"
const CONNECTOR=Symbol("connector")
const DSTATE=Symbol("dstore_data")
const isDebugger=true;

class ItemWatcher{
  constructor(){
    this._changeHander=[];
    this._fatherItemWatcher;
  }
  bindFatherItemWatcher(itemWatcher){
    this._fatherItemWatcher=itemWatcher;
  }
  onChange(handler){
    this._changeHander.push(handler);
  }
  _change(key,value){
    let _stop=false;
    const event={
      stopBubble(){
        _stop=true;
      }
    }
    event.key=key;
    event.value=value;
    this._changeHander.forEach((item)=>{
      item(event);
    });
    if(!_stop&&this._fatherItemWatcher){
      this._fatherItemWatcher._change(key,value);
    }
  }
}

function addOnChangeLister(state,cb){
  if(!state||state.__type!=DSTATE){
    return console.warn("this object is not dstore state");
  }
  state.__ItemWatcher.onChange(function(key,value){
    cb(key,value);
  });
};

function addItemWatcher(state,fatherItemWatcher){
  const itemWatcher=new ItemWatcher();
  itemWatcher.bindFatherItemWatcher(fatherItemWatcher);
  Object.defineProperty(state,"__ItemWatcher",{
      enumerable: false,
      writable: false,
      configurable: false,
      value:itemWatcher
  });
  Object.defineProperty(state,"__type",{
      enumerable: false,
      writable: false,
      configurable: false,
      value:DSTATE
  });
  return itemWatcher;
}

function createStore(configObj){
  const state=RecursionCreateState(configObj);
  return state;
}

function RecursionCreateState(configObj,fatherState){
  const state={};
  const itemWatcher=addItemWatcher(state,fatherState&&fatherState.__ItemWatcher);

  const keys=Object.keys(configObj);
  keys.forEach((key,index)=>{
    const setter=configObj[key];
    if(setter!=null&&typeof(setter)=="object"){ // object
      const subState=defineObjectState(key,setter,state);
    }else{
      defineState(key,setter,state);
    }
  });
  return state;
}

function defineObjectState(key,setter,state){
  const subState=RecursionCreateState(setter,state);
  Object.defineProperty(state,key,{
      enumerable: true,
      value:subState
  });
  return subState;
};

function defineState(key,setter,state){
  let value;
  let inSetter;
  let set; // definedProperty set;
  let init=true;
  if(typeof(setter)=="function"){ // function 
    set=(newValue)=>{
      if(inSetter==1){
        return console.warn("old value can't modify ",key);
      }
      inSetter=1;

      const resultValue=setter(newValue,{
        type:init?"INIT":"UPDATE"
      });
      if(Array.isArray(resultValue)){
        addItemWatcher(resultValue,state.__ItemWatcher); //
        resultValue.forEach((item)=>{
          if(typeof(item)=="object"&&item.__type==DSTATE){
            item.__ItemWatcher.bindFatherItemWatcher(resultValue.__ItemWatcher);
          }
        });
      }else if(typeof(resultValue)=="object"){
        if(resultValue.__type==DSTATE){
          resultValue.__ItemWatcher.bindFatherItemWatcher(state.__ItemWatcher);
        }else{
          return console.error("setter 中的返回值必须为 DStore ，DStore 数组，或者其他非对象基本类型数据");
        }
      }
      const t=value;
      value=resultValue;
      if(t!==resultValue){
        !init&&state.__ItemWatcher._change(key,value);
      }
      inSetter=0;
    }
  }else{ // string, num, bool,.......
    value=setter;
    set=(newValue)=>{
      !init&&state.__ItemWatcher._change(key,newValue,value);
      isDebugger&&console.warn(key + ":This value is const, if you want modify, you can use function replaced! ");
    }
  }
  Object.defineProperty(state,key,{
      enumerable: true,
      set:set,
      get(){
        return value;
      }
  });

  if(typeof(setter)=="function"){ // function 
    state[key]=undefined;
  }
  init=false;
};


const A=createStore({
  name:"fefefe",
  data:{
    subName(newValue="nnname",context){
      if(context.type=="UPDATE"){
        A.data.subData=""
        A.data.subTest=""
      }
      return newValue;
    },
    subData(newValue="1"){
      return newValue;
    },
    subTest(newValue="2"){
      return newValue;
    }
  }
});

const B=createStore({
  name:"nnnnnnn"
});

const t=createStore({
  name:"fefefe",
  ttt:function(newValue){
    return newValue;
  },
  test:function(newValue){
    if(newValue&&newValue.type=="change"){
      return [newValue.DStore]; 
    }else{
      return [A];
    }
//    return [A,B,"fe"];
  },
  a:{
    b:{
      c:{
        d:()=>{
          return "abc"
        }
      }
    }
  }
});

addOnChangeLister(t,function(Event){
  Event.stopBubble();
  console.log("root-----------------------------------",Event);
});

addOnChangeLister(A,function(Event){
  console.log("A-----------------------------------",Event);
});
addOnChangeLister(B,function(Event){
  console.log("B-----------------------------------",Event);
});

console.log(JSON.stringify(t));
setTimeout(function(){
  t.test[0].data.subName="fefe";
  console.log(JSON.stringify(t));
},3000);

setTimeout(function(){
 t.test={type:"change",DStore:A};
  setTimeout(function(){
    console.log("set A");
    A.name="ff:eeeee"
    t.test={type:"change",DStore:B};
    setTimeout(function(){
      console.log("set B");
      B.name="dweeeee"
      t.test={type:"change",DStore:A};
    },2000);

  },2000);
},8000);

window.fff=t;

console.log(t,JSON.stringify(t));