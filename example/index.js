import React from "react"
import ReactDOM from "react-dom"
import DStore ,{Store,watch} from "../src/index";

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

var aObj={
  abc:1
}

          const t=new Store({
            taaa:1
          })
class Page extends React.Component{
  constructor(p,c){
    super(p,c);
    this.store=new Store({
        a:function(newValue,context){
          console.log(context);
          //return t;
          return StoreConnector([t,t]);
          return [t,t]
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
    console.log(this.store.Store["a"]);
    this.store.Store["a"].onChange(function(a,b,c){
      console.log("aaaaaaaa",a,b,c);
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



