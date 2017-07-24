import Provider ,{watch as _watch} from "./connect.js"
export default Provider;
export const watch = _watch;

let isDebugger=true;

function creator(key,set,state){
  let value;
  let status=0;
  let setter;
  if(typeof(set)=="function"){
      setter=(newValue)=>{
        this.rootStore.link=(Store)=>{
          Store.rootStore=this.rootStore;
          Store.fatherStore=this;
          if(!this.Store[key]){
            this.Store[key]=[];
          }
          this.Store[key].push(Store);
        }
        if(status==1){
          return console.warn("old value can't modify ",key);
        }
        status=1;
        const resultValue=set.call(this.rootStore,newValue,value,this.store)
        value=resultValue;
        this._fireChange(value);
        status=0;

      };
  }else if(set!=null&&typeof(set)=="object"){
      value=state;
      setter=(newValue)=>{
        isDebugger&&console.warn(key,newValue,"This key is not a setter function!");
      };
  }else{
      value=set;
      setter=(newValue)=>{
        isDebugger&&console.warn(key,newValue,"This key is const!");
      };
  } 
  Object.defineProperty(this.state,key,{
      enumerable: true,
      set:setter,
      get(){
        return value;
      }
  });
  if(typeof(set)=="function"){
    this.state[key]=undefined;
  }
}


export class Store{
  constructor(reduce,rootStore,fatherStore){
    this.state={}
    this._onChangeHandler=[];
    this.rootStore=rootStore||this;
    this.fatherStore=fatherStore;
    this.Store={};
    for(var i in reduce){
      const temp=reduce[i];
      this.reConfig(i,temp,false);
    }
    Object.preventExtensions(this.state); //使对象不可扩展
    if(this.fatherStore==undefined){// 根 store
      console.log("fefefeffffffffff");
    }
  }
  reConfig(i,temp,preventE){
      if(temp&&typeof(temp)=="object"){
        if(Object.keys(temp).length>0){
          this.Store[i]=new Store(temp,this.rootStore,this);
          creator.call(this,i,temp,this.Store[i].state)
        }else{
          isDebugger&&console.warn("reduce ' "+i+" 'is a empty object");
        }
      }else{
        creator.call(this,i,temp);
      }
      preventE!=false&&Object.preventExtensions(this.state); //使对象不可扩展
  }
  _fireChange(){
    let isStop=false;
    this._onChangeHandler.forEach((item)=>{
      const Event={
        stopBubble(){
          isStop=true;
        }
      };
      item(Event);
    });
    if(!isStop){
      this.fatherStore&&this.fatherStore._fireChange();
    }
  }
  onChange(handler){
    this._onChangeHandler.push(handler);
  }
}


//------------mock----------------//

const TypeA=new Store({
  name:"A",
  data:{
    name:(newValue)=>{
      console.log("123");
      return newValue+"typeAfe"
    }
  },
});

const TypeB=new Store({
  name:"B",
  data:{
    name:()=>{
      console.log("123");
      return "fe"
    }
  },
});

const TypeC=new Store({
  "op": null,
  "type": "ACTION",
  "data": {
    "actionType": "PURCHASE",
    "actionData": {
      "brandIds": [
        "20067"
      ],
      "cateId": null,
      "dateType": "RELATIVE_RANGE",
      "days": "5",
      "date": null,
      "rangeDate": null,
      "channelId": null,
      "shopIdsStr": null,
      "itemIdsStr": null,
      "money": {
        "min": null,
        "max": null,
        "op": "CLOSE_CLOSE"
      },
      "frequency": {
        "min": 1,
        "max": null,
        "op": "OPEN_CLOSE"
      },
      "itemPrice": null,
      "cityIdsStr": null,
      "storeIdsStr": null
    }
  }
});

const f=new Store({
  "a":{
    "b":{
      "c":(newValue)=>{
        return newValue;
      }
    },
    "test":function(newValue="A",oldValue){
      this.link(TypeA);
      this.link(TypeB);
      return [TypeA.state,TypeB.state];
    }
  },
  "b":{
    what:()=>{

    }
  }
});


console.log(f.Store["a"].Store["b"]);
f.onChange(()=>{
  console.log("rrrrrrrrrrrrrrrrrrrrr");
});
f.Store["a"].onChange((Event)=>{
  console.log("aaaaaaaaaaaaaaaaaaaaaa");
});
f.Store["a"].Store["b"].onChange((Event)=>{
  console.log("fffffffffffff");
});
f.Store["a"].Store["test"][1].onChange((Event)=>{
  console.log("l.................");
});
setTimeout(function(){
  //f.state.a.b.c="fe";
  TypeB.state.data.name="fffff";
},2000);





window.fff=f;
window.AAA=TypeA;
window.BBBB=TypeB;
window.C=TypeC;