import React, {PropTypes} from 'react'

import {Table,Popconfirm,Icon} from "antd"
import  EditableCell from "../EditableTable/EditableCell"
import Cropper from "react-cropper"
import "./cropper.less"
import "./prop.less"
import {isEmptyArray, isEmptyObject} from "../../utils/ArrayUtil";


/**
 * Object版本的属性编辑表格
 */

export default  class PropsTableObj extends React.Component {
  state = {
    data:{},
    editable:this.props.editable,
    _KEY_MAP_:{}
  };
  initData=(str)=>{
    try{
      let data={}
      if(str.constructor==String){
          data =JSON.parse(str)||{}
          this.setState({data:JSON.parse(str)||{}})
      }else if(str.constructor==Array){
          data=str
         this.setState({data:str})
      }else if(str.constructor==Object){
        data=str
      }
      for(let name in data){
        if(this.state._KEY_MAP_[name] ==null)
            this.state._KEY_MAP_[name]=Math.random()
      }
      this.setState({data:data})
    }catch (e){
      console.log(e)
      this.setState({data:{}})
    }
  }
  componentDidMount=()=>{
    this.initData(this.props.data)
  }
  componentWillReceiveProps(nextProps) {
    this.initData(nextProps.data)
  }

  addOneProp=()=>{
    this.setState({data:{ ...this.state.data,_new_key:"new_value"}})
  }

  delProp=(index)=>{
    let newdata={...this.state.data}
    //newdata.splice(index,1)
    delete newdata[index]
    this.setState({data:newdata})
  }
  changeKey=(oldKey,newKey)=>{
    let newdata={...this.state.data}
    let backUp=newdata[oldKey]
    delete newdata[oldKey]
    newdata[newKey]=backUp
    let rkey=this.state._KEY_MAP_[oldKey]
    this.state._KEY_MAP_[newKey]=rkey
    delete this.state._KEY_MAP_[oldKey]
    this.setState({data:newdata},this.save)
  }
  changeValue=(key,newValue)=>{
    let newdata={...this.state.data}
    newdata[key]=newValue
    this.setState({data:newdata},this.save)
   // this.state.data[key]=newValue
  }
  save=()=>{
    if(this.props.onSave){
      this.props.onSave(JSON.stringify(this.state.data))
    }
  }

  buildObjDiv=(obj)=>{
    if(obj!=null && obj.constructor==String) return  null
    let out=[];
    if(this.props.editable){
      for(let item in obj){
        out.push(<div key={this.state._KEY_MAP_[item]} className="pdiv">
          <span className="key">  <input value={item}   onChange={(e)=>this.changeKey(item,e.target.value)}/></span>
          <span className="value"><input value={obj[item]} onChange={(e)=>this.changeValue(item,e.target.value)}/> </span>
          <span onClick={()=>this.addOneProp()} className="mini-btn plus-btn"><i className="anticon anticon-plus-circle"/></span>
          <span onClick={()=>this.delProp(item)} className="mini-btn plus-btn"><i className="anticon anticon-minus-circle"/></span>
        </div>)
      }

      if(isEmptyObject(obj)){
        out.push(<div key="-0"><span onClick={this.addOneProp} className="mini-btn plus-btn"><i className="anticon anticon-plus-circle"/></span></div>)
      }
    }else{
      for(let item in obj) {
        out.push(<div key={this.state._KEY_MAP_[item]} className="pdiv">
            <span className="key">{item}</span>
          <Icon type="arrow-right" />
            <span className="value preview">{obj[item]}</span>
          </div>
        )
      }
      if(isEmptyArray(obj)){
        out.push(<div key="0">空白</div>)
      }
    }
    return out
  }

  render() {
    return(
      <div  className="PropTable">
        {this.buildObjDiv(this.state.data)}
      </div>
    )
  }
}
