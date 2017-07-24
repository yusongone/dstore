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

const List=watch(["list as t"])(class _list extends React.Component{
  constructor(p,c){
    super(p,c);
  }
  render(){
    return (<div>123</div>)
  }
});


class Page extends React.Component{
  constructor(p,c){
    super(p,c);
    this.store=new Store({
        a:"123",
        lists:()=>{
          return [1,2,3]
        }
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



