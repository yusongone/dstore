import {createState} from "../src/index"


function getFullLink(){
  return createState({
    type(newValue){
      console.log(newValue);
      return "OFFLINE";
    },
    data:{
      name(newValue="name:abc"){
        return newValue;
      },
      age(newValue="age:18"){
        return newValue;
      }
    }
  });
}

function getCrowdAttr(){
  return createState({
    type(){
      return "CROWD_ATTR";
    },
    data:{
      name(newValue="fe"){
        return newValue;
      },
      age(newValue="18"){
        return newValue;
      }
    }
  });
}

const t=createState({
  // valueOrComomond = {type:"changeType","index":index,data:value}
  conditionLists(valueOrCommond={},context){
    console.log(context);
    if(context.type=="INIT"){
      const state=getFullLink();
      const state2=getCrowdAttr();
      return [state,state2];
    }else if(valueOrCommond.type=="changeType"){
      console.log(context);
    }
  },
  test:{
    myName(newValue="fe"){
      return newValue;
    }
  }
});

setTimeout(function(){
  t.test.myName="eee"
},3000);

export default t;