import React from "react"
import ReactDOM from "react-dom"
import DStore ,{Store,watch,StoreConnector} from "../src/index";

let i=0;

class CrowdAttrUI extends React.Component{
  constructor(p,c){
    super(p,c);
    console.log("fffffeeeeeeeeeeeeee");

  }
  render(){
    const {dataStore,typeStore}=this.props;
              console.log(typeStore.state);
    return <div>
            <select 
              value={typeStore.state} 
              onChange={(event)=>{
                const value=event.target.value;
                typeStore.state=value;
              }}
            >
            <option  value="CROWD_ATTR" >CA</option>
            <option  value="OFFLINE" >of</option>
          </select>
          <div 
            onClick={function(){
              dataStore.state.days="fffffffffffffffffff";
            }}
          >
            {dataStore.state.days}
          </div>
    </div>
  }
}

const List=watch(["lists as t","test.a.b as bb","a as AStores"])(class _list extends React.Component{
  constructor(p,c){
    super(p,c);
  }
  render(){
    const {AStores} = this.props;
    const list=AStores.Store.map((Store,i)=>{
      console.log(Store.type);
      if(Store.type.state=="CROWD_ATTR"){
        let C=watch([{"dataStore":Store.data,"typeStore":Store.type}],{changeBubble:false})(CrowdAttrUI);
        return <C key={"op"+i} />;
      }else if(Store.type.state=="OFFLINE"){
        let C=watch([{"dataStore":Store.data,"typeStore":Store.type}],{changeBubble:false})(CrowdAttrUI);
        return <C key={"op"+i} />;
      }
      return <div>404</div>;
    });
    return (<div>fefe{list}</div>)
  }
});


const Offline=new Store({
  type:()=>{
    console.log("ffff");
    return "OFFLINE";
  },
  myType:()=>{
    return "fff";
  },
  data:{
    days:(newValue)=>{
      return newValue+"bOffline";
    }
  }
});

  const crowdAttr=new Store({
    type:()=>{
    console.log("ffff");
      return "CROWD_ATTR";
    },
    data:{
      days:(newValue)=>{
        return newValue+"aCrowdAttr";
      }
    }
  })
function getCrowdAttr(){
  return crowdAttr;
}

class Page extends React.Component{
  constructor(p,c){
    super(p,c);
    this.store=new Store({
        a:function(newValue){
          console.log("ffffff--------------");
          return new StoreConnector([getCrowdAttr(),Offline,getCrowdAttr()]);
        },
        test:{
          a:{
            b:()=>{
              return 123;
            }
          }
        },
        lists:()=>{
          return [1,2,3]
        },
    });
  }
  render(){
    return(
      <DStore store={this.store} >
        <div>
          <List></List>
          <div>btn</div>
        </div>
      </DStore>
    ) 
  }
} 

ReactDOM.render(<Page crowdId={12345} />,document.getElementById("body"));
/*
*/



