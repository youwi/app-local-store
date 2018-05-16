import React, {PropTypes} from 'react'

import {Table, Popconfirm, Select, Tooltip, Icon, Button,Modal} from "antd"
import  EditableCell from "./EditableCell"
import "./table.less"
import EditableTable from "./EditableTable";
import PropsTable from "../PropTable/PropsTable";


import { Link } from 'dva/router'
import {buildTypeList} from "./ShareMod";
import {isStringLike} from "../../utils/ArrayUtil";
import { message } from 'antd';
export default  class EditableTableForType extends EditableTable {

  filterKeyOther=(filterString, record, filed)=>{
    if(filed==="typeMainParentId"){
      let itemPid=record[filed]
      for(let item of this.props.data){
        if(item.typeId==itemPid)
          return this.isContains(item.typeName,filterString)
      }
    }
    return false
  }
  isContains=(big,sm)=>{
    if(big!=null && sm !=null){
        big=big.toLowerCase()
        sm=sm.toLowerCase()
      if(big.indexOf(sm)>-1){
        return true
      }
    }
    return false
  }
  buildTypeCol=(id)=>{
    for(let s of this.props.data){
      if(s.typeId==id){
        return (
          <Tooltip title={<span className="nameid-fix-title">{s.typeShortName} id:{s.typeId}</span> }  >
            <span className="nameid-fix">{s.typeName}</span>
          </Tooltip>
        )
      }
    }
  }
  deleteOrRestore=(data,index,type)=>{
    if(data[index].typeId<0){
      let ask=data[index]
      this.props.onDelete&&this.props.onDelete(ask)
      data.splice(index,1)
    }else{
      for(let sk of this.state.dataBackUp){
        if(sk.typeId==data[index].typeId){
          this.objCopy(data[index],sk)
        }
      }
    }
  }
  objCopy=(obj,ori)=>{
    if(obj && ori){
      for(let key in obj){
        obj[key]=ori[key]
      }
    }
  }
  buildItemCol=(id)=>{
    for(let s of this.props.data){
      if(s.itemId==id){
        return (
          <Tooltip title={<span className="nameid-fix-title">{s.itemShortName} id:{s.itemId}</span> }  >
            <span className="nameid-fix">{s.itemName}</span>
          </Tooltip>
        )
      }
    }
  }
  parseStringToArray=(text)=>{
    if(text==null){
      return []
    }else{
      return text.split(",")
    }
  }
  buildTypeList=()=>{
    return  this.props.pimTypes.map((item,i)=>(<Select.Option key={item.typeId} value={item.typeId}>{item.typeName}</Select.Option>))
  }
  buildItemList=()=>{
    return this.props.data.map((item)=><Select.Option key={item.itemId} value={item.itemId}>{item.itemName}/{item.itemId}</Select.Option>)
  }

  buildPropsButton=(data, index, key, text,rowId)=>{
    return (
      <span size={"small"} className="props-btn" onClick={()=>this.toggleExpandedRowKeys(data,index,text,rowId)}>
        <Icon type="paper-clip" />
      </span>
    )
  }

  expandedRowRender=(record)=><PropsTable data={ record.typeProps } editable={record._editable} onSave={(v)=>record.typeProps=v}/>


  toggleExpandedRowKeys=(data,index,text,rowId)=>{

    if(this.state.expandedRowKeys===null) this.state.expandedRowKeys=[]
    if(this.state.expandedRowKeys.indexOf(rowId)>-1 ) {
      this.state.expandedRowKeys.splice(this.state.expandedRowKeys.indexOf(rowId),1)
    }else{
      this.state.expandedRowKeys.push(rowId)
    }
    this.setState({expandedRowKeys:this.state.expandedRowKeys})
  }
  handleChangeType=(data,index,value)=>{
    data[index].typeId=value
  }

  handleChangeParentId=(data,index,value)=>{
    data[index].itemMainParentId=value
  }
  handleChangeBy=(data,index,key,value)=>{
    if(value.constructor ==Array){
      value=value.join(",")
    }
    data[index][key]=value
  }
  selectCurrentType=(tp)=>{
    this.props.selectCurrentType &&  this.props.selectCurrentType(tp)

  }
  checkRequire=(obj)=>{
    if( obj.typeName==null ||obj.typeName==""){
      message.error('名称必填');
      return false
    }
    if(obj.typeShortName==null ||obj.typeShortName==""){
      message.error('缩写名必填');
      return false
    }
    for(let sk of this.props.data){
      if(sk.typeShortName==obj.typeShortName && sk.typeId!=obj.typeId){
        message.error('缩写名重复');
        return false
      }
    }
  }
  buildItemMainParentId=()=>{
    return <Select showSearch style={{ width: 100 }}  placeholder="选择栏目" optionFilterProp="children"
                   onChange={(v)=>this.handleChangeParentId(data,index,v)}
                   filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
      {this.buildTypeList()}
    </Select>
  }
  handleChangeType=(data,index,value)=>{
    data[index].typeMainParentId=value
  }

  translate=(text)=>{
    let ori={
      typeId:"ID",
      typeName:"名称",
      typeShortName:"唯一名称",
      typeDesc:"描述",
      typeProps:"属性",
      typeMainParentId:"上级ID",
    }
    return ori[text];
  }
  hasDeletePermisssion=()=>{
    if(this.props.hasDeletePermission){
      return this.props.hasDeletePermission()
    }
    return false
  }
  getEmptyObj=()=>{
     return [{
       typeId:"",
       typeName:"",
       typeShortName:"",
       typeDesc:"",
       typeProps:"",} ]
  }
  getRowKey=()=>{
    return "typeId"
  }



  renderColumns = (data, index, key, text) => {
    const {_editable, status} = data[index];
    if(key==="typeId"){
      if(data[index].typeId<0){
        return <span className="unsave-msg">未保存</span>
      }
    }
    if(key==="typeProps"){
      let rowId=data[index].typeId
      return this.buildPropsButton(data, index, key, text,rowId)
    }

    if (typeof _editable === 'undefined') {
      if (key === "typeId"){
        return <span>{text}</span>;
      }
      if(key ==="typeMainParentId"){
        return this.buildTypeCol(text)
      }
      if(key ==="typeName"){
        //名称生成连接
        return <span><Link onClick={()=>this.selectCurrentType(data[index])} to={"typeProps/"+data[index].typeShortName}>{text}</Link></span>
        //return <span><Link to={"types/"+data[index].typeShortName}>{text}</Link></span>
      }
      return <span>{text}</span>;
    } else {
      if (key === "typeId"){
        return <span>{text}</span>;
      }
      if( key==="typeMainParentId"){
        return    <Select allowClear={true}
                          showSearch style={{ width: 100 }}  placeholder="选择分类" optionFilterProp="children" defaultValue={text||undefined}
                          onChange={(v)=>this.handleChangeType(data,index,v)}
                          filterOption={(input, option) => isStringLike(option.props.fill,input)}>
          {buildTypeList(this.props.data)}
        </Select>
      }




      return (<EditableCell key={index} editable={_editable} value={text} onChange={value => this.handleChange(key, index, value)} />)


    }
  }
}
//||<span className="like-placehodler">可选分类</span>
