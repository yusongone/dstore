import React,{Children} from "react";

export class Store{
  constructor(state){
    this.childStores=[];
    this._onChangeHandler=[];
    this.mainStore=new SubStore(state,this);
    this.state=this.mainStore.state;
  }
  getStoreByState(state){
    const store=this.mainStore.find(state)
  }
  getState(){
    return this.state;
  }
  getSubItem(reduce){
     const plc=new SubStore(reduce);
     this.childStores.push(plc);
     return plc.state;
  }
  onChange(){
    this._onChangeHandler.push(handler);
  }
  triggerOnChange(newValue,oldValue){
    this._onChangeHandler.forEach(function(item) {
      item(newValue,oldValue);
    });
  }
  RunTimeBind=(state)=>{
    let findStore=this.mainStore.find(state);
    if(!findStore){
      this.childStores.forEach((store)=>{
         const subStore=store.find(state)
         if(subStore){findStore=subStore};
      });
    }
    findStore.onChangeBubbleBreakOff(true);
    return (Component)=>{
      return class WatchComponent extends React.Component{
        constructor(p,c){
          super(p,c);
          findStore.onChange(()=>{
            this.forceUpdate();
          });
        }
        render(){
          const t={dstoreData:state};
          const props={...this.props,...t}
          return <Component {...props} />
        }
      }
    }
  }
}


function creator(key,set){
  let value;
  const self=this;
  let status=0;
  Object.defineProperty(this.state,key,{
      enumerable: true,
      set(newValue){
        if(status==1){
          return console.warn("old value can't modify ",key);
        }
        status=1;
        const resultValue=set.call(self.rootStore,newValue,value,self.store)
        self.triggerOnChange(value,resultValue);
        value=resultValue;
        status=0;
      },
      get(){
        return value;
      }
  });
  this.state[key]=undefined;
}


class SubStore{
  constructor(reduce,rootStore,fatherStore){
    this.state={}
    this._changeBubbleBreakOff=false;
    this.rootStore=rootStore;
    this.fatherStore=fatherStore||rootStore;
    this.StoreMap={};
    this._onChangeHandler=[];
    for(var i in reduce){
      const temp=reduce[i];
      if(typeof(temp)=="function"){
        creator.call(this,i,temp);
      }else if(typeof(temp)=="object"){
        this.StoreMap[i]=new SubStore(temp,rootStore,this);
        this.state[i]=this.StoreMap[i].state;
      }
    }
    console.log("------",this.state);
    Object.preventExtensions(this.state); //使对象不可扩展
  }
  onChangeBubbleBreakOff(bool){
    this._changeBubbleBreakOff=bool;
  }
  onChange(handler){
    this._onChangeHandler.push(handler);
  };
  triggerOnChange(newValue,oldValue){
    this._onChangeHandler.forEach(function(item) {
      item(newValue,oldValue);
    });
    if(!this._changeBubbleBreakOff){
      this.fatherStore&&this.fatherStore.triggerOnChange(newValue,oldValue);
    }
  }
  find(state){
    if(state==this.state){
      return this;
    }else{
      for(let i in this.StoreMap){
        let temp=this.StoreMap[i].find(state);
        if(temp){
          return temp;
        }
      }
    }
  }
}


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



//------------mock----------------//
const f=new Store({
  "a":{
    "b":{
      "c":(newValue)=>{
        return newValue;
      }
    }
  },
  "ary":(newValue={},oldValue)=>{
    const c=oldValue?oldValue.concat([]):[];
    if(newValue.commond=="push"){
      c[newValue.index]=newValue.value
    }
    return c;
  },
  "op":(op)=>{
    return op;
  },
  "type":(type)=>{
    return type;
  },
  "data":{
    "actionType":()=>{

    },
    "actionData":{
      "brandIds":(ary)=>{
        return ary;
      },
      "cateId":(cateId)=>{
        return cateId;
      },
      "dateType":()=>{

      },
      "days":(days=12)=>{
        return days;
      },
      "money":()=>{
        return {
          "min":null,
          "max":null,
          "op":"CLOSE_CLOSE"
        }
      }
  }
  }
});


window.fff=f;