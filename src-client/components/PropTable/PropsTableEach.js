import React from 'react';
import PropTypes from 'prop-types';


import {Table, Popconfirm, Tooltip, Icon,Switch,Select} from "antd"
import  EditableCell from "../EditableTable/EditableCell"
import Cropper from "react-cropper"
import "./cropper.less"
import "./prop.less"
import {isEmptyArray, isEmptyObject} from "../../utils/ArrayUtil";
import {SelectUser} from "../EditableTable/ShareMod";

const isNullString=(str)=>{
  if(str==null) return true

  if(str.trim&& str.trim()==""){
    return true
  }
  return false
}

export default  class PropsTableEach extends React.Component {
  state = {
    data: [],
    dataBackUp:[],
    surportTypeList:[
      { key:"1",value:"姓名"},
      // { key:"2",value:"图片"},
      // { key:"3",value:"数字"},
      // { key:"4",value:"网址"},
    ]
  };
  findSurportTypeListValueByName=(typeId)=>{
      for(let s of this.state.surportTypeList){
        if(s.key==typeId){
          return s.value
        }
      }
      return ""
  }
  initData = (props) => {
    try {
      let str=props.data
      if(str==null){
        this.setState({data: []})
        return
      }
      let data=[]
      let dataBackUp=[]
      let strBackUp=props.dataBackUp
      if (str.constructor == String) {
        data = JSON.parse(str) || []
      }else if (str.constructor == Array) {
        data=str
      }
      if (strBackUp.constructor == String) {
        dataBackUp = JSON.parse(strBackUp) || []
      }else if (strBackUp.constructor == Array) {
        dataBackUp=str
      }
      let mdata =this.mergeByKey(this.state.data,data)
      this.deleteDup(mdata)
      this.setState({data:mdata,dataBackUp})
    } catch (e) {
      console.log(e)
      this.setState({data: []})
    }
  }
  mergeByKey=(oriData,newData)=>{
    /*去除已经删除的值*/
    for(let i=0;i<oriData.length;i++){
      let found=false
      for(let j=0;j<newData.length;j++){
        if(newData[j].key==oriData[i].key){
          found=true
        }
      }
      if(found){

      }else{
        if(!oriData[i].__editable__){
            oriData.splice(i,1)
            i--
        }
      }
    }
    let backUp=[...oriData]
    for(let n of newData){
      let found=false
      for(let old of oriData){
        if(old.key==n.key){
          old.value=n.value
          old.__editable__=n.__editable__
          found=true
        }
      }
      if(!found){
        backUp.push(n)
      }
    }
    return backUp
  }
  deleteDup=(arr)=>{
    if(arr==null ||arr.length==0 ) return
    for(let i=0;i<arr.length;i++){
      for(let j=i;j<arr.length;j++){
        if(j==i) continue
        let a=arr[i]
        let b=arr[j]
        if((a.key==b.key && a.value!=b.value )|| (a.key==b.key && a.id==b.id)){
          arr.splice(j,1)
          j--
        }
      }
    }
  }
  componentDidMount = () => {
    this.initData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps)
  }

  addOneProp = () => {
    this.setState({data: [...this.state.data, {key: "", value: ""}]})
  }
  addProp = (index) => {
    let newdata = [...this.state.data]
    newdata.splice(index, 0, {key: "", value: ""})
    this.setState({data: newdata})
  }
  delProp = (index) => {
    let newdata = [...this.state.data]
    let keyString=newdata[index].key
    newdata.splice(index, 1)
    if( this.props.deleteOne){
      this.props.deleteOne(keyString)
    }

    this.setState({data: newdata})
  }
  changeKey = (index, value) => {
    let newdata = [...this.state.data]
    newdata[index].key = value
    this.setState({data: newdata}, this.save)
  }
  changeValue = (index, value) => {
    let newdata = [...this.state.data]
    newdata[index].value = value
    this.setState({data: newdata}, this.save)
  }
  changeValueType=(index,value)=>{
    let newdata = [...this.state.data]
    newdata[index].type = value
    this.setState({data: newdata}, this.save)
  }
  save = () => {
    if (this.props.onSave) {
      this.deleteDup(this.state.data)
      this.props.onSave(JSON.stringify(this.state.data))
    }
  }
  commitOneProp = (index) => {
    this.props.saveOne&&this.props.saveOne(index)
  }
  cancelEditOne = (index) => {
    /*取消编辑要做还原*/
    let newdata = [...this.state.data]
    delete newdata[index].__editable__
    if(newdata[index].key.trim()=="" && newdata[index].value.trim()==""){
      newdata.splice(index,1)
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
  toggleDisable=(index,v)=>{
    let newdata = [...this.state.data]
    if(newdata[index].disabled){
      delete newdata[index].__editable__
    }else{
      newdata[index].disabled=true
    }
    if(this.props.disableOne){
      this.props.disableOne(newdata[index].key,v)
    }
    newdata[index].disabled=v
    this.setState({data: newdata}, this.save)
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
    if (text != null && text !== "") {
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
    if(isNullString(newdata[index].key)){
      return false
    }
    if(isNullString(newdata[index].value)){
      if(this.isNeedValue(index)){
        return true
      }
      return false
    }
    /*重复不能保存*/
    if(this.isDup(index)){
      return false
    }

    return true
  }
  /*判断重复*/
  isDup=(index)=>{
    let data=this.state.data
    /*忽略没有输入的情况*/
    if(isNullString(data[index].key) && isNullString(data[index].value)){
      return false
    }
    for(let i=0;i<data.length;i++){
      let item=data[i]
      if((item.key==data[index].key) && (index>i)){
        return true
      }
    }
    return false
  }
  isSaved=(item)=>{
    if(item.__editable__==false || item.__editable__==null){
      let found=false
      for(let k of this.state.dataBackUp){
          if(k.key==item.key){
            if(k.value==item.value){
              found=true
              break
            }
          }
      }
      return found
    }else{
      return true
    }
  }
  /*从备份中还原值*/
  restoreValue=(item)=>{
    if(item.__editable__==false || item.__editable__==null){
      for(let k of this.state.dataBackUp){
        if(k.key==item.key){
          item.value=k.value
          item.type=k.type
          this.setState({data:this.state.data})
        }
      }
    }
  }
  isNeedValue=(i)=>{
     return  this.props.isNeedValue==false
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
      if(item.id==null) item.id=Math.random()
      if (item.__editable__) {
        return <div key={item.id} className="pdiv">
          <span className="key">{this.props.isCanEditKey==false?<span>{item.key}</span>:<input value={item.key} onChange={(e) => this.changeKey(i, e.target.value)}/>}</span>
          {
            this.isNeedValue(i)?null:<span className="value">
              {item.type=="2" ||item.type=="1"?<SelectUser value={item.value} onChange={(v)=>this.changeValue(i,v)}/>:
                <input value={item.value} onChange={(e) => this.changeValue(i, e.target.value)} onPaste={(e) => this.pasteImg(e, i)}/>}
            </span>
          }
          {
            this.isDup(i)?<span>{nameTip}</span>:null
          }
          {!this.isNeedValue(i)?null: <Select
                showSearch
                allowClear={true}
                style={{ width: 200 }}
                placeholder="可选一个类型"
                optionFilterProp="children"
                defaultValue={item.type}
                onChange={(v)=>this.changeValueType(i,v)}
                filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                { this.state.surportTypeList.map(v=><Select.Option key={v.key}>{v.value}</Select.Option>)}
          </Select>
          }

          <span className="btn-box">
            {
              this.canSave(i)?null:<span className="  edit-first  preview-btn">{saveTip}</span>
            }
            {
              !this.canSave(i)?null:<span className=" edit-first  preview-btn" onClick={() => this.commitOneProp(i) }><Icon type="check-circle"/></span>
            }
             <span className="  t-edit preview-btn" onClick={() => this.cancelEditOne(i) }><Icon type="close-circle"/></span>
          </span>
        </div>
      } else {
        return <div key={item.id} className="pdiv">
          <span className="key">{item.key}</span>
          <span className="value preview">{this.buildLogoPreview(item.value)}</span>
          {
            this.isSaved(item)?null:<span><span className="unsave-msg">未保存</span>
              <span className="reload-restore" onClick={()=>this.restoreValue(item)}><Icon type="reload" /></span>
            </span>
          }
          {
            !this.isNeedValue(i)?null:<span className="type-mark">{this.findSurportTypeListValueByName(item.type)}</span>
          }
          <span className="btn-box">

              {/*<span onClick={()=>this.addProp(i)} className="mini-btn plus-btn"><i className="anticon anticon-plus-circle"/></span>*/}
            {this.props.isCanDelete==false?null:<span className="t-edit-first preview-btn" onClick={() => this.delProp(i)} ><Icon type="delete"/></span> }
            {
              this.props.hasPermission==false?null:<span className="btn-box"><span className="t-edit-first preview-btn" onClick={() => this.toggleEdit(i)}><Icon type="edit"/></span>
                <Switch size={"small"} checked={item.disabled!=false} onChange={(v)=>this.toggleDisable(i,v)} checkedChildren={'开'} unCheckedChildren={'关'} />
              </span>
            }
          </span>
        </div>
      }
    })

    if (isEmptyArray(obj)) {
      out.push(<div>无属性</div>)
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
