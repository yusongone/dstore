import Provider ,{watch as _watch} from "./connect.js"
export default Provider;
export const watch = _watch;

const STORE=Symbol("store");
const STORE_CONNECTOR=Symbol("store_connector");

let isDebugger=true;


function creator(key,set,state){
  let value;
  let status=0;
  let setter;
  if(typeof(set)=="function"){
      setter=(newValue)=>{
        if(status==1){
          return console.warn("old value can't modify ",key);
        }
        status=1;

        const resultValue=set.call(this,newValue)

        if(resultValue&&resultValue.__type==STORE_CONNECTOR){
          const states=resultValue.setter(this.Store,key);
          value=states;
        }else{
          console.log(key,value);
          value=resultValue;
        }
        this._fireChange(resultValue);
        status=0;
      };
  }else if(set!=null&&typeof(set)=="object"){
      if(Object.keys(set).length==0){
        value=set;
        setter=(newValue)=>{
          isDebugger&&console.warn(key,newValue,"This key is const Object!");
        };
      }else{
        value=state;
        setter=(newValue)=>{
          isDebugger&&console.warn(key,newValue,"This key is not a setter function!");
        };
      }
  }else{
      setter=(newValue)=>{
        value=set;
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
  if(typeof(set)!="object"){
    this.state[key]=undefined;
  }
  return value;
}

class BasicStore{
  constructor(fatherStore){
    this.__type = STORE;
    this.state={}
    this._onChangeHandler=[];
    this.fatherStore=fatherStore;
  }
  _fireChange(newValue){
    let isStop=false;
    this._onChangeHandler.forEach((item)=>{
      const Event={
        stopBubble(){
          isStop=true;
        },
        /*
        preValue:oldValue,
        value:newValue,
        */
      };
      item(Event);
    });
    if(!isStop){
      this.fatherStore&&this.fatherStore._fireChange(newValue);
    }
  }

  onChange(handler){
    this._onChangeHandler.push(handler);
  }

}

class LeafStore extends BasicStore{
  constructor(fatherStore,setValue,key){
    super(fatherStore);
    console.log(this.state,setValue);
  }
}

export class Store extends BasicStore{
  constructor(reduce,fatherStore){
    super(fatherStore);
    this.Store={};
    for(var i in reduce){
      const temp=reduce[i];
      this.reConfig(i,temp,false);
    }
    Object.preventExtensions(this.state); //使对象不可扩展
    if(this.fatherStore==undefined){// 根 store
    }
  }
  reConfig(i,temp,preventE){
      if(temp&&typeof(temp)=="object"){
        if(Object.keys(temp).length>0){
          this.Store[i]=new Store(temp,this);
          creator.call(this,i,temp,this.Store[i].state)
        }else{
          isDebugger&&console.warn("reduce ' "+i+" 'is a empty object");
        }
      }else{ // function get state
        this.Store[i]=new LeafStore(this,temp);
        const resultValue=creator.call(this,i,temp);
        this.Store[i].state=resultValue;
      }
      preventE!=false&&Object.preventExtensions(this.state); //使对象不可扩展
  }
}


function _isStoreHandler(Store,key){
  const subStore=this.Stores.Store
  for(var i in subStore){
    subStore[i].fatherStore=Store[key];
    Store[key].Store=subStore;
  }
  return this.Stores.state;
}

function _isArrayHandler(Store,key){
  const states=this.Stores.map(function(item){
    return item.state;
  });
  this.Stores.forEach(function(item){
    const subStore=item.Store;
    for(var i in subStore){
      subStore[i].fatherStore=Store[key];
    }
    if(!Store[key].Store){
      Store[key].Store=[]
    }
    Store[key].Store.push(subStore);
  });
  return states;
}

export class StoreConnector{

  constructor(stores){
    this.__type=STORE_CONNECTOR;
    this.Stores;
    this.setterHandlers;

    if(stores.__type==STORE){
      this.Stores=stores;
      this.setterHandlers=_isStoreHandler;
    }else if(Array.isArray(stores)){
      let haveUnStore=false;
      stores.forEach(function(item){
        if(item.__type!=STORE){
          haveUnStore=true;
        }
      });
      if(haveUnStore){
        console.error("Store connector's Array item must be a store object!");
        return false;
      }
      this.Stores=stores;
      this.setterHandlers=_isArrayHandler;
    }else{
      console.error("Store connector's parameter must be support Array or Store object!");
    }
  }
  setter(Store,key){
      const states=this.setterHandlers(Store,key);
      return states;
  }
}



//------------mock----------------//

/*

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
console.log(f);
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
*/