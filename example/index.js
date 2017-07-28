import React from "react"
import ReactDOM from "react-dom"
const CONNECTOR=Symbol("connector")
const DSTATE=Symbol("dstore_data")
const isDebugger=true;


class ItemWatcher{
  constructor(){
    this._changeHander=[];
  }
  onChange(handler){
    this._changeHander.push(handler);
  }
  _change=(key,value)=>{

    this._changeHander.forEach(function(item){
      item(key,value);
    });
    console.log("have Change -----",key,value,this._changeHander);
  }
}

function addOnChangeLister(state,cb){
  if(state.__type!=DSTATE){
    return console.warn("this object is not dstore state");
  }

  state.__ItemWatcher.onChange(function(key,value){
    cb(key,value);
  });
};

function addItemWatcher(state){
    Object.defineProperty(state,"__ItemWatcher",{
        enumerable: false,
        writable: false,
        configurable: false,
        value:new ItemWatcher()
    });
    Object.defineProperty(state,"__type",{
        enumerable: false,
        writable: false,
        configurable: false,
        value:DSTATE
    });
}

function createStore(configObj){
  const state=RecursionCreateState(configObj,(state)=>{
    addItemWatcher(state);
  });
  return state;
}

function RecursionCreateState(configObj,cb){
  const state={};
  cb&&cb(state);
  const keys=Object.keys(configObj);
  keys.forEach((key,index)=>{
    const setter=configObj[key];
    if(setter!=null&&typeof(setter)=="object"){ // object
      defineObjectState(key,setter,state);
    }else{
      defineState(key,setter,state);
    }
  });
  return state;
}

function defineObjectState(key,setter,state){
  const subState=RecursionCreateState(setter,(subState)=>{
    addItemWatcher(subState);
  });
  Object.defineProperty(state,key,{
      enumerable: true,
      value:subState
  });
  addOnChangeLister(state,function(){
    console.log("fefefefefefefef");
  });
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

      const resultValue=setter.call(this,newValue);
      if(resultValue&&resultValue.__type==CONNECTOR){
        console.log("abcd");
      }else{
        value=resultValue;
      }
      !init&&state.__ItemWatcher._change(key,value);
    }
  }else{ // string, num, bool,.......
    value=setter;
    set=(newValue)=>{
      console.log(state.__ItemWatcher);
      !init&&state.__ItemWatcher._change(key,value);
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


class Link{

}

function link(obj){
  const link=new Link();
  if(Array.isArray(obj)){

  }else{

  }
  return link;
}






const A=createStore({
  name:"fefefe"
});

const B=createStore({
  name:"fefefe"
});

const t=createStore({
  name:"fefefe",
  test:()=>{
    return link([A,B]);
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

addOnChangeLister(t.a.b.c,function(){
  console.log("f-----------------------------------");
});

setTimeout(function(){
  t.name="fff"
},2000);

window.fff=t;

console.log(t,JSON.stringify(t));