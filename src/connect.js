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
export const watch = (ary)=>{
  return (Component)=>{
    return class Box extends React.Component{
      static contextTypes = {
        store:React.PropTypes.object
      }
      constructor(p,c){
        super(p,c);
        let Store;
        console.log(c.store);
        pathOrStore
        if(typeof(pathOrStore)=="string"){
          let ary=pathOrStore.split(".");
          ary.reduce((preOjb,item)=>{

          })
        }else if(pathOrStroe!=null&&typeof(pathOrStore)=="object"){

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