import {createState} from "../src/index"


function getFullLink(){
  return createState({
    type:"OFFLINE",
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

function getCrowdAttr(){
  return createState({
    type:"CROWD_ATTR",
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
  conditionLists(valueOrCommond={},context){
    if(valueOrCommond.type=="creat"){
    }
    const state=getFullLink();
    const state2=getCrowdAttr();
    return [state,state2];
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