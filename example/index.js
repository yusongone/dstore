import React from "react"
import ReactDOM from "react-dom"
const CONNECTOR=Symbol("connector")
const DSTATE=Symbol("dstore_data")
const isDebugger=true;

class Event{
  _stop=false;
  stopBubble(){
    this._stop=true;
  }
}

class ItemWatcher{
  constructor(fatherItemWatcher){
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
    this._changeHander.forEach((item)=>{
      const event=new Event();
      event.key=key;
      event.value=value;
      item(event);
      if(!event._stop&&this._fatherItemWatcher){
        this._fatherItemWatcher._change(key,value);
      }
    });
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
  Object.defineProperty(state,"link",{
      enumerable: false,
      writable: false,
      configurable: false,
      value:function(subState){
        subState.__ItemWatcher.bindFatherItemWatcher(itemWatcher);
      }
  });
  return itemWatcher;
}

function createStore(configObj){
  const state=RecursionCreateState(configObj);
  state.__ItemWatcher.onChange((key,value)=>{
    console.log("------",key,value);
  })
  window.sss=state;
  return state;
}

function RecursionCreateState(configObj,fatherItemWatcher){
  const state={};
  const itemWatcher=addItemWatcher(state,fatherItemWatcher);

  const keys=Object.keys(configObj);
  keys.forEach((key,index)=>{
    const setter=configObj[key];
    if(setter!=null&&typeof(setter)=="object"){ // object
      const subState=defineObjectState(key,setter,state,itemWatcher);
    }else{
      defineState(key,setter,state);
    }
  });
  return state;
}

function defineObjectState(key,setter,state,itemWatcher){
  const subState=RecursionCreateState(setter,itemWatcher);
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

      const resultValue=setter.call(state,newValue);
      if(resultValue&&resultValue.__type==CONNECTOR){
        console.log("abcd");
      }else{
        value=resultValue;
      }
      !init&&state.__ItemWatcher._change(key,value);
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


class Link{
  __type=CONNECTOR;
  constructor(){

  }

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
  name:"nnnnnnn"
});

const t=createStore({
  name:"fefefe",
  test:function(){
    console.log(this);
    this.link(A);
    return [A,B,"fe"];
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
console.log(t);

addOnChangeLister(t.a.b,function(Event){
  console.log("fefe-----------------------------------",Event);
});
console.log(A);
addOnChangeLister(A,function(Event){
  console.log("tA-----------------------------------",Event);
});
addOnChangeLister(t.test,function(Event){
  console.log("test-----------------------------------",Event);
});

addOnChangeLister(t.a.b.c,function(Event){
  Event.stopBubble();
  console.log("f-----------------------------------",Event);
});

setTimeout(function(){
  A.name="eeeee"
},2000);

window.fff=t;

console.log(t,JSON.stringify(t));