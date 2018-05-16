import React, {PropTypes} from 'react'
import {Link} from 'dva/router'
import {Table, Popconfirm, Select, Tooltip, Icon, Button, Modal,Switch} from "antd"
import  EditableCell from "./EditableCell"
import "./table.less"
import EditableTable from "./EditableTable";
import PropsTable from "../PropTable/PropsTable";

import {buildTypeList, buildItemList, LabelItem, LabelType, SelectTypes, SelectItem} from "./ShareMod"
export default  class EditableTableForOperation extends EditableTable {

  handleChangeType = (data, index, value) => {
    data[index].typeId = value
  }

  handleChangeBy = (data, index, key, value) => {
    if (value.constructor == Array) {
      value = value.join(",")
    }
    data[index][key] = value
  }

  translate = (text) => {
    let ori = {
      "opId": "ID",
      "opItem": "栏目ID",
      "opType": "类型ID",
      "opState": "完成状态",
      "opName": "操作名称",
      "opTime": "时间",
      "updateTime": "更新时间",
      "loading":"暂无数据"
    }
    return ori[text];
  }
  getRowKey=()=>{
    return "opId"
  }
  deleteOrRestore=(data,index,type)=>{
    let tmp=data[index]
    if(data[index].opId<0){
      data.splice(index,1) //长度变化了
      this.props.onDelete&&this.props.onDelete(tmp)
    }else{
      for(let sk of this.state.dataBackUp){
        if(sk.opId==data[index].opId){
          this.objCopy(data[index],sk)
        }
      }
    }
  }
 hasDeletePermisssion=()=>{
    return  this.props.isCanDelete
 }

  renderColumns = (data, index, key, text) => {
    const {_editable, status} = data[index];
    if (key === "opId") {
      if (data[index].opId < 0) {
        return <span className="unsave-msg">未保存</span>
      }else{
        return <span>{text}</span>
      }
    }
    if (key === "opState") {
      return <span> <Switch checkedChildren={'开'} unCheckedChildren={'关'} onChange={v=>this.handleChange(key, index, v)}/></span>
    }

    if (typeof _editable === 'undefined') {
      if(key==="opType"){
        return <LabelType id={text}/>
      }
      if(key==="opItem"){
        return <LabelItem id={text}/>
      }
      return <span>{text}</span>;
    } else {
      if(key==="opType"){
        return <SelectTypes onChange={value => this.handleChange(key, index, value)} value={text}/>
      }
      if(key==="opItem"){
        return <SelectItem   onChange={value => this.handleChange(key, index, value)} value={text}/>

      }
      else{
        return (<EditableCell key={index} editable={_editable} value={text + ""} onChange={value => this.handleChange(key, index, value)}/>)
      }
    }

  }

}
// return  <Select allowClear={true} showSearch  defaultValue={data[index][key]||""} onChange={value => this.handleChange(key, index, value)}  style={{ width: 200 }}>
//   {buildTypeList(this.props.pimTypes)}
// </Select>
