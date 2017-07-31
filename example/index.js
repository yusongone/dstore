import React from "react"
import ReactDOM from "react-dom"
import state from "./stateFactory"
import {Provider,watch} from "../src/index"


class CrowdAttrUI extends React.Component{
  constructor(p,c){
    super(p,c);
    console.log("fffffeeeeeeeeeeeeee");

  }
  render(){
    const {data,type}=this.props;
    return <div>
            <select 
              value={type} 
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
        return <C key={"op"+index} />;
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
      lists:getState("conditionLists"),
      name:getState("test.myName")
    })(_Lists);
    return <div>
      <Lists />
    </div>
  }
}


ReactDOM.render(
  <Provider state={state}>
    <Page crowdId={12345} /> 
  </Provider>
  ,document.getElementById("body"));