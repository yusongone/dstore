import React from "react"
import ReactDOM from "react-dom"
import DStore ,{Store,watch,StoreConnector} from "../src/index";

class A extends React.Component{
  constructor(p,c){
    super(p,c);
    console.log('feffffffffff-----------');
  }
  render(){
    return <div
      onClick={()=>{
          this.props.dstoreData.data=i++;
      }}
    >{this.props.dstoreData.data.actionType}</div>
  }
}

let i=0;

class B extends React.Component{
  constructor(p,c){
    super(p,c);
    console.log('feffffffffffsssss----------');
  }
  render(){
    return <div
      onClick={()=>{
          this.props.dstoreData.data=i++;
      }}
    >{this.props.dstoreData.data}</div>
  }
}

const List=watch(["lists as t","test.a.b as bb","a"])(class _list extends React.Component{
  constructor(p,c){
    super(p,c);
  }
  render(){
    return (<div>123</div>)
  }
});

const crowdAttr=new Store({
  type:"CROWD_ATTR",
  data:{
    days:(newValue)=>{
      return newValue+"aCrowdAttr";
    }
  }
})

const Offline=new Store({
  type:"OFFLINE",
  data:{
    days:(newValue)=>{
      return newValue+"bOffline";
    }
  }
});

    setTimeout(()=>{
      crowdAttr.state.data.days="fffff";
      setTimeout(()=>{
        Offline.state.data.days="offffff";
      },2000);
    },2000);


class Page extends React.Component{
  constructor(p,c){
    super(p,c);
    this.store=new Store({
        a:function(newValue){
          return new StoreConnector([crowdAttr,Offline]);
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
    console.log(JSON.stringify(this.store.state),this.store);
    this.store.Store["a"].onChange((a,b,c)=>{
      console.log("aaaaaaaa",JSON.stringify(this.store.state));
    });
    /*
    setTimeout(()=>{
      this.store.reConfig("lists",()=>{
        return [4,5,6];
      });
    },2000);
    */
  }
  render(){
    return(
      <DStore store={this.store} >
        <div>
          <select>
            <option>1</option>
          </select>
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



