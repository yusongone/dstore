import React from "react"
import ReactDOM from "react-dom"
import DStore ,{Store} from "../src/index";

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
    >{this.props.dstoreData.data}</div>
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
const myStore=new Store({
  a:{
    b:{
      c(newValue){
        return newValue;
      }
    }
  },
  dataList(newValue){
    const A=this.getSubItem({
      type:()=>{
        return "A"
      },
      data:(newValue)=>{
        return newValue+"eeeee";
      }
    });
    const B=this.getSubItem({
      type:()=>{
        return "B"
      },
      data:(newValue="??")=>{
        return newValue+"fff";
      }
    });
    return [A,B];
  }
});
setTimeout(()=>{
  myStore.getState().a.b.c="fffff"
});

class Page extends React.Component{
  render(){
    const RunTimeBind=myStore.RunTimeBind;
    const list=myStore.getState().dataList.map(function(state){
      let WatchCom;
      if(state.type=="A"){
        WatchCom=RunTimeBind(state.data)(A);
      }else{
        WatchCom=RunTimeBind(state)(B);
      }

      return <WatchCom key={state.type} ></WatchCom>

    });
    return(
      <div>
        {list}
        <select>
          <option>1</option>
        </select>
        <div>btn</div>
      </div>
    ) 
  }
} 

ReactDOM.render(<DStore store={myStore}>
    <Page />
  </DStore>
,document.getElementById("body"));



