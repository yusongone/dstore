import React,{Children} from "react";

import {DSTATE} from "./state_manage"

export const getStateFullLink=(rootState,state)=>{
  const ary=[];
  function doit(rootState,state){
    if(typeof(rootState)!="object"){return false}
    for(var i in rootState){
      let temp=rootState[i];
      if(temp===state){
        ary.push({key:i,obj:temp});
        return temp;
      }else{
        const result=doit(temp,state);
        if(result){
          ary.push({key:i,obj:temp});
          return temp;
        }
      }
    }
    return false;
  }
  doit(rootState,state);
  return ary;
}


export class Provider extends React.Component{
  static childContextTypes = {
    state:React.PropTypes.object
  }

  constructor(props, context){
    super(props, context);
  }

  getChildContext(a,b){
    return {
      state:this.props.state
    }
  }

  render(){
    return  Children.only(this.props.children);
  }
}



/*
  watch function
*/

function _getState(rootState,strOrObj){
  if(typeof(strOrObj)=="object"&&strOrObj.__type==DSTATE){
    return strOrObj;
  }else if(typeof(strOrObj)=="string"){
    let ary=strOrObj.split(".");
    let stepState=rootState;
    for(let i=0;i<ary.length;i++){
      let key=ary[i]
      let tempState;
      if(stepState[key]!=undefined){
        tempState=stepState[key];
      }
      stepState=tempState;
      if(!tempState){
        return stepState;
      }
    }
    return stepState;
  }
}

export const getState =()=>{

}

export const watch = (OW,option)=>{
  return (Component)=>{
    return class Box extends React.Component{
      static contextTypes = {
        state:React.PropTypes.object
      }
      constructor(p,c){
        super(p,c);
        const rootState=c.state;
        this.state={}
        this.status="create";
        for(var i in OW){
          const state=OW[i];
          this.state[i]=state;
          if(state.__ItemWatcher){
            state.__ItemWatcher.onChange(()=>{
              if(this.status!="unmount"){
                const updateState={};
                updateState[i]=state;
                this.setState(updateState);
              }
            });
          }else{
            const ary=getStateFullLink(rootState,state);
            ary[1].obj.__ItemWatcher.onChange((Event)=>{
              if(this.status!="unmount"&&Event.key==OW[i].split(".").pop()){
               const state=_getState(rootState,OW[i]);
                const updateState={};
                updateState[i]=state;
                this.setState(updateState);
              }
            });
          }
        }
      }
      render(){
        const props={...this.props,...this.state}
        return <Component {...props} />
      }
      componentWillUnmount(){
        this.status="unmount";
      }
    }
  }
}