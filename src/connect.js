import React,{Children} from "react";

export default class Provider extends React.Component{
  static childContextTypes = {
    store:React.PropTypes.object
  }

  constructor(props, context){
    super(props, context);
    this.data= props.data;
  }

  getChildContext(a,b){
    return {
      store:this.props.store
    }
  }

  render(){
    return  Children.only(this.props.children);
  }
}



/*
  watch function
*/
export const watch = (OW)=>{
  return (Component)=>{
    return class Box extends React.Component{
      static contextTypes = {
        store:React.PropTypes.object
      }
      constructor(p,c){
        super(p,c);
        let Store;
        this.ASMap={};
        const rootStore=c.store;

        OW.map((item)=>{
          const tempSplit=item.split(" as ");
          if(tempSplit[1]!=undefined){
            this.ASMap[tempSplit[0]]=tempSplit[1];
          }else{
            this.ASMap[tempSplit[0]]=tempSplit[0];
          }
          return tempSplit[0];
        });

        for(var i in this.ASMap){
          const temp=this.ASMap[i];
          getStore(i);
        }

        function getStore(str){
          let ary=str.split(".");
          let stepStore=rootStore;
          for(let i=0;i<ary.length;i++){
            let key=ary[i]
            let tempStore;
            if(stepStore["Store"]){
              if(stepStore["Store"][key]!=undefined){
                tempStore=stepStore["Store"][key];
              }
            }
            stepStore=tempStore;
            if(!tempStore){
              break;
            }
          }
          console.log(stepStore);
        }

      }
      render(){
        const mergeAsState={};
        for(let i in this.state){
          let key=this.ASMap[i];
          if(key){
            mergeAsState[key]=this.state[i];
          }else{
            mergeAsState[i]=this.state[i];
          }
        }
        const props={...this.props,...mergeAsState}
        return <Component {...props} />
      }
    }
  }
}