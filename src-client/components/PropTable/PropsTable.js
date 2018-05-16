import React, {PropTypes} from 'react'

import {Table,Popconfirm} from "antd"
import  EditableCell from "../EditableTable/EditableCell"
import Cropper from "react-cropper"
import "./cropper.less"
import "./prop.less"
import {isEmptyArray, isEmptyObject} from "../../utils/ArrayUtil";


export default  class PropsTable extends React.Component {
  state = {
    data:[],
    editable:this.props.editable
  };
  initData=(str)=>{
    try{
      if(str.constructor==String)
         this.setState({data:JSON.parse(str)||[]})
      else if(str.constructor==Array){
         this.setState({data:str})
      }
    }catch (e){
      this.setState({data:[]})
    }
  }
  componentDidMount=()=>{
    this.initData(this.props.data)
  }
  componentWillReceiveProps(nextProps) {
    this.initData(nextProps.data)
  }

  addOneProp=()=>{
    this.setState({data:[...this.state.data,{key:"",value:""}]})
  }
  addProp=(index)=>{
    let newdata=[...this.state.data]
    newdata.splice(index,0,{key:"",value:""})
    this.setState({data:newdata})
  }
  delProp=(index)=>{
    let newdata=[...this.state.data]
    newdata.splice(index,1)
    this.setState({data:newdata})
  }
  changeKey=(index,value)=>{
    let newdata=[...this.state.data]
    newdata[index].key=value
    this.setState({data:newdata},this.save)
  }
  changeValue=(index,value)=>{
    let newdata=[...this.state.data]
    newdata[index].value=value
    this.setState({data:newdata},this.save)
  }
  save=()=>{
    if(this.props.onSave){
      this.props.onSave(JSON.stringify(this.state.data))
    }
  }
  pasteImg=(e,i)=>{
    if(e.clipboardData.types.indexOf('Files') > -1){
      let reader = new FileReader();
      let it=e.clipboardData.items[0];
      reader.readAsDataURL( it.getAsFile());
      reader.onload=(ev)=>{
        this.changeValue(i,reader.result)
      };
      e.preventDefault();
    }
  }
  buildLogoPreview=(text)=>{
    if(text!==null && text!==""){
      if(text.indexOf("data:image")===0){
        return <img src={text} />
      }else{
        return null
      }
    }
  }

  _crop=(index)=>{
      this.state.data[index].valueCrop=this.refs.cropper.getCroppedCanvas().toDataURL()
  }

  buildCropDiv(value,index) {
    if(value.indexOf("data:image")===0) {
      return (
        <Cropper
          ref='cropper'
          src={value}
          style={{height: 100, width: '100%'}}
          // Cropper.js options
          aspectRatio={16 / 9}
          viewport={{ width: 100, height: 100 }}
          boundary={{ width: 100, height: 100 }}
          showZoomer={false}
          enableOrientation={true}
          guides={false}
          crop={()=>this._crop(index)}/>
      );
    }
  }


  buildObjDiv=(obj)=>{
    let out=[];
    if(this.props.editable){
      out=obj.map((item,i)=><div key={i} className="pdiv">
          <span className="key">  <input value={item.key}   onChange={(e)=>this.changeKey(i,e.target.value)}/></span>
          <span className="value"><input value={item.value} onChange={(e)=>this.changeValue(i,e.target.value)} onPaste={(e)=>this.pasteImg(e,i)}/> </span>
          <span className="right-btn">
            <span onClick={()=>this.addProp(i)} className="mini-btn plus-btn"><i className="anticon anticon-plus-circle"/></span>
            <span onClick={()=>this.delProp(i)} className="mini-btn plus-btn"><i className="anticon anticon-minus-circle"/></span>
          </span>
          <span className="preview">{this.buildLogoPreview(item.value,i)}</span>
          <span className="preview">{this.buildCropDiv(item.value,i)}</span>
        </div>
      )
      if(isEmptyArray(obj)){
        out.push(<div key="-0"><span onClick={this.addOneProp} className="mini-btn plus-btn"><i className="anticon anticon-plus-circle"/></span></div>)
      }
    }else{
      out=obj.map((item,i)=><div key={i} className="pdiv">
        <span className="key" >{item.key}</span>
        <span className="value preview" >{this.buildLogoPreview(item.value)}</span>
        </div>
      )
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
