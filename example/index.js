import React from "react"
import ReactDOM from "react-dom"
import state from "./stateFactory"
import {Provider,watch} from "../src/index"

const crowdTypes={
  "CROWD_ATTR":"人群属性",
  "OFFLINE":"线下触点"
}

class CrowdAttrUI extends React.Component{
  constructor(p,c){
    super(p,c);
    console.log("fffffeeeeeeeeeeeeee");

  }
  render(){
    let {data,type}=this.props;
    let options=[];
    for(var i in crowdTypes){
      options.push(<option key={i} value={i} >{crowdTypes[i]}</option>);
    }
    return <div>
            <select 
              value={type} 
              onChange={(event)=>{
                const value=event.target.value;
                this.props.onTypeChange&&this.props.onTypeChange(value);
              }}
            >
            {options}
          </select>
          <div 
            onClick={function(){
              data.name="eef"
            }}
          >
            {data.name}
            {data.age}
          </div>
    </div>
  }
}

class _Lists extends React.Component{
  render(){
    const ary=this.props.lists.map(function(item,index){
      if(item.type=="CROWD_ATTR"){
        let C=watch({data:item.data,type:item.type},{changeBubble:false})(CrowdAttrUI);
        return (
          <C 
          key={"op"+index} 
          onTypeChange={(value)=>{
            this.props.lists={type:"changeType","index":index,data:value}
          }}
          />
          );
      }else if(item.type=="OFFLINE"){
        let C=watch({data:item.data,type:item.type},{changeBubble:false})(CrowdAttrUI);
        return <C key={"op"+index} />;
      }
      return <div>404</div>;
    });
    return <div>{ary}</div>
  }
}

class Page extends React.Component{
  render(){
    
    const Lists=watch({
        lists:state.conditionLists,
        name:state.test.myName
    })(_Lists);
    return <div>
      <Lists />
    </div>
  }
}

//----------------------- 因为watch 对象中 存在 字符串，容易和state 的字符串冲突，需要找到新的 watch 方法；

ReactDOM.render(
  <Provider state={state}>
    <Page crowdId={12345} /> 
  </Provider>
  ,document.getElementById("body"));
