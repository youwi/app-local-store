import React, {PropTypes} from 'react'

import {Table, Popconfirm, Tooltip, Icon,Switch} from "antd"
import  EditableCell from "../EditableTable/EditableCell"
import Cropper from "react-cropper"
import "./cropper.less"
import "./prop.less"
import {isEmptyArray, isEmptyObject} from "../../utils/ArrayUtil";

const isNullString=(str)=>{
  if(str==null) return true

  if(str.trim&& str.trim()==""){
    return true
  }
  return false
}

export default  class PropsTableOperation extends React.Component {
  state = {
    data: [],
    dataBackUp:[]
  };

  componentDidMount = () => {
    this.setState({data:this.props.data||[]})
  }

  componentWillReceiveProps(props) {
    this.setState({data:props.data||[]})
  }
  hasPermissionEdit=()=>{
    return false
  }


  delProp = (index) => {
    let newdata = [...this.state.data]
    newdata.splice(index, 1)
    if( this.props.deleteOne){
      this.props.deleteOne(newdata[index].opId)
    }
    // this.setState({data: newdata})
  }
  changeName = (index, value) => {
    let newdata = [...this.state.data]
    newdata[index].opName = value
    this.setState({data: newdata}, this.save)
  }
  changeValue = (index, value) => {
    let newdata = [...this.state.data]
    newdata[index].value = value
    this.setState({data: newdata}, this.save)
  }
  save = () => {
    if (this.props.onSave) {
      this.props.onSave(JSON.stringify(this.state.data))
    }
  }
  commitOneProp = (opId) => {
    this.props.saveOne&&this.props.saveOne( this.findItemByOpId(opId))
  }
  findItemByOpId=(id)=>{
    for(let sk of this.state.data){
      if(id==sk.opId)
        return sk
    }
    return {}
  }

  cancelEditOne = (opId) => {
    let newdata = [...this.state.data]
    let item=this.findItemByOpId(opId)
    if(item!=null){
      delete item.__editable__
    }
    if( isNullString( item.opName) ){
      this.props.deleteOne&& this.props.deleteOne(item.opId)
    }
    this.setState({data: newdata}, this.save)
  }
  toggleEdit=(index)=>{
    let newdata = [...this.state.data]
    if(newdata[index].__editable__){
      delete newdata[index].__editable__
    }else{
      newdata[index].__editable__=true
    }
    this.setState({data: newdata}, this.save)
  }
  toggleDisable=(opId,v)=>{
    let newdata = [...this.state.data]
    let item=this.findItemByOpId(opId)
    item.opState=this.hasPasOver(v)
    this.props.saveOne&&this.props.saveOne(item)
  }
  hasPasOver=(bool)=>{
    if(bool) return 0
    else return 1
  }
  pasteImg = (e, i) => {
    if (e.clipboardData.types.indexOf('Files') > -1) {
      let reader = new FileReader();
      let it = e.clipboardData.items[0];
      reader.readAsDataURL(it.getAsFile());
      reader.onload = (ev) => {
        this.changeValue(i, reader.result)
      };
      e.preventDefault();
    }
  }
  buildLogoPreview = (text) => {
    if (text != null && text != "") {
      if (text.indexOf("data:image") === 0) {
        return <img src={text}/>
      } else {
        return text
      }
    }
  }

  _crop = (index) => {
    this.state.data[index].valueCrop = this.refs.cropper.getCroppedCanvas().toDataURL()
  }

  buildCropDiv(value, index) {
    if (value.indexOf("data:image") === 0) {
      return (
        <Cropper
          ref='cropper'
          src={value}
          style={{height: 100, width: '100%'}}
          // Cropper.js options
          aspectRatio={16 / 9}
          viewport={{width: 100, height: 100}}
          boundary={{width: 100, height: 100}}
          showZoomer={false}
          enableOrientation={true}
          guides={false}
          crop={() => this._crop(index)}/>
      );
    }
  }
  canSave=(index)=>{
    let newdata = [...this.state.data]
    /*为空不能保存*/
    if(isNullString(newdata[index].opName)){
      return false
    }
    return true
  }




  buildObjDiv = (obj) => {
    let out = [];
    let nameTip = <Tooltip placement="top" title={"名称不唯一"}>
      <Icon type="exclamation-circle"/>
    </Tooltip>
    let saveTip = <Tooltip placement="left" title={"输入不正确"}>
      <Icon type="exclamation-circle"/>
    </Tooltip>
    let urlTop = <Tooltip placement="top" title={"不能为空"}>
      <Icon type="exclamation-circle"/>
    </Tooltip>
    out = obj.map((item, i) => {
      if (item.__editable__) {
        return <div key={item.opId} className="pdiv">
          <span className="key">  <input value={item.opName} onChange={(e) => this.changeName(i, e.target.value)}/></span>
           {/*<span className="value"><input value={item.value} onChange={(e) => this.changeValue(i, e.target.value)} onPaste={(e) => this.pasteImg(e, i)}/> </span>*/}
           <span className="btn-box">
            {
              this.canSave(i)?null:<span className="  edit-first  preview-btn">{saveTip}</span>
            }
            {
              !this.canSave(i)?null:<span className=" edit-first  preview-btn" onClick={() => this.commitOneProp(item.opId) }><Icon type="check-circle"/></span>
            }
             <span className="  t-edit preview-btn" onClick={() => this.cancelEditOne(item.opId) }><Icon type="close-circle"/></span>
          </span>
        </div>
      } else {
        return <div key={item.opId} className="pdiv">
          <span className="key">{item.opName}</span>
          { item.opId<0?<span className="unsave-msg">未保存</span>:null}
          {/*<span className="value preview">{this.buildLogoPreview(item.opName)}</span>*/}
          {!this.hasPermissionEdit()?null:<span className="btn-box">
            {/*<span onClick={()=>this.addProp(i)} className="mini-btn plus-btn"><i className="anticon anticon-plus-circle"/></span>*/}
            <span className="t-edit-first preview-btn" onClick={() => this.delProp(i)} ><Icon type="delete"/></span>
            <span className="t-edit-first preview-btn" onClick={() => this.toggleEdit(i)}><Icon type="edit"/></span>
            <Switch size={"small"} checked={item.opState!=1} onChange={(v)=>this.toggleDisable(item.opId,v)} checkedChildren={'未完成'} unCheckedChildren={'已完成'} />
          </span>}

        </div>
      }
    })

    if (isEmptyArray(obj)) {
      out.push(<div>无操作</div>)
      // out.push(<div key="-0"><span onClick={this.addOneProp} className="mini-btn plus-btn"><i className="anticon anticon-plus-circle"/></span></div>)
    }

    return out
  }

  render() {
    return (
      <div className="PropTable">
        {this.buildObjDiv(this.state.data)}
      </div>
    )
  }
}
