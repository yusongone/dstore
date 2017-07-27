import React,{Children} from "react";

export default class Provider extends React.Component{
  static childContextTypes = {
    store:React.PropTypes.object
  }

  constructor(props, context){
    super(props, context);
    this.data= props.data;
  }

  getChildContext(a,b){
    return {
      store:this.props.store
    }
  }

  render(){
    return  Children.only(this.props.children);
  }
}



function _getStore(str){
  const rootStore=this.rootStore;
  let ary=str.split(".");
  let stepStore=rootStore;
  for(let i=0;i<ary.length;i++){
    let key=ary[i]
    let tempStore;
    if(stepStore["Store"]){
      if(stepStore["Store"][key]!=undefined){
        tempStore=stepStore["Store"][key];
      }
    }
    stepStore=tempStore;
    if(!tempStore){
      return stepStore;
    }
    return stepStore;
  }
}
/*
  watch function
*/

function _mapStringStoreToASMap(item){
  const tempSplit=item.split(" as ");
  if(tempSplit[1]!=undefined){
    this.ASMap[tempSplit[0]]={
      mapName:tempSplit[1],
      store:null
    }
  }else{
    this.ASMap[temSplit[0]]={
      mapName:tempSplit[0],
      store:null
    }
  }

  for(var i in this.ASMap){
    const temp=this.ASMap[i];
    const store=this._getStore(i,);
    temp.store=store;
    this.state[i]=store;

    bindChange.call(this,store)
  }
}

function bindChange(store){
    store.onChange((Event)=>{
      if(this.option.changeBubble===false){
        Event.stopBubble();
      }
      for(var i in this.ASMap){
        const map=this.ASMap[i];
        const key=map.mapName;
        const temp={};
        temp[key]=map.store;
        this.setState(temp);
      };
    });
}

function _mapObjStoreToASMap(item){
  for(var i in item){
    const store=item[i];
    this.ASMap[i]={
      mapName:i,
      store:item[i]
    }
    this.state[i]=store;
    bindChange.call(this,store)
  }
}


export const watch = (OW,option)=>{
  return (Component)=>{
    return class Box extends React.Component{
      static contextTypes = {
        store:React.PropTypes.object
      }
      constructor(p,c){
        super(p,c);
        let Store;
        this.ASMap={};
        this.option=option||{};
        this.rootStore=c.store;
        this.state={}
        OW.map((item)=>{

          if(item!=null&&typeof(item)=="object"){
            _mapObjStoreToASMap.call(this,item);
          }else if(typeof(item)=="string"){
            _mapStringStoreToASMap.call(this,item);
          }else{
            console.warn("watch item illegal!");
          }

        });

      }
      _getStore=_getStore
      render(){
        const mergeAsState={};
        for(let i in this.state){
          let key=this.ASMap[i].mapName;
          if(key){
            mergeAsState[key]=this.state[i];
          }else{
            mergeAsState[i]=this.state[i];
          }
        }
        const props={...this.props,...mergeAsState}
        return <Component {...props} />
      }
    }
  }
}