import React, {PropTypes} from 'react'
import { Link } from 'dva/router'
import {Table, Popconfirm, Select, Tooltip, Icon, Button,Modal} from "antd"
import  EditableCell from "./EditableCell"
import "./table.less"
import EditableTable from "./EditableTable";
import PropsTable from "../PropTable/PropsTable";
import {buildTypeList, SelectItem, SelectItemG} from "./ShareMod";
import { message } from 'antd';

export default  class EditableTableForItem extends EditableTable {

  filterKeyOther=(filterString, record, filed)=>{
    if(filed==="itemMainParentId"){
      let itemPid=record[filed]
      for(let item of this.props.dataBig){
        if(item.itemId==itemPid)
          return this.isContains(item.itemName,filterString)
      }
    }
    if(filed==="typeId"){
      let itemPid=record[filed]
      for(let item of this.props.pimTypes){
        if(item.typeId==itemPid)
          return this.isContains(item.typeName,filterString)
      }
    }
    return false
  }
  deleteOrRestore=(data,index,type)=>{
    let tmp=data[index]
    if(data[index].itemId<0){
      data.splice(index,1) //长度变化了
      this.props.onDelete&&this.props.onDelete(tmp)
    }else{
      for(let sk of this.state.dataBackUp){
        if(sk.itemId==data[index].itemId){
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
  getRowKey=()=>{
    return "itemId"
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
    if(this.props.pimTypes==null) {
      return <span className="nameid-fix">{id}</span>
    }
    for(let s of this.props.pimTypes){
      if(s.typeId==id){
        return (
        <Tooltip title={<span className="nameid-fix-title">唯一名称:{s.typeShortName} <br/>id:{s.typeId}</span> }  >
            <span className="nameid-fix">{s.typeName}</span>
        </Tooltip>
        )
      }
    }
  }
  buildItemCol=(id)=>{
   if(this.props.dataBig===null) return id
    for(let s of this.props.dataBig){
      if(s.itemId==id){
        return (
          <Tooltip title={<span className="nameid-fix-title">{s.itemShortName} id:{s.itemId}</span> }  >
            <span className="nameid-fix">{s.itemName}</span>
          </Tooltip>
        )
      }
    }
  }
  buildMutlItemCol=(text)=>{
    let arr=this.parseStringToArray(text)
    let bigDiv=[]
    if(this.props.dataBig===null) return text
    for(let id of arr){
      for(let s of this.props.dataBig){
        if(s.itemId==id){
          bigDiv.push(<div key={s.itemId}>{s.itemName}/{s.itemId}</div>)
        }
      }
    }
    return   <Tooltip title={bigDiv}  >
      {text}
    </Tooltip>


  }

  parseStringToArray=(text)=>{
    if(text==null|| text=="" ||text.trim()==""){
      return []
    }else{
      return text.split(",")
    }
  }
  /*限制类型的下拉菜单*/
  limitTypeBuildItemList=(typeId)=>{
    let out=[]
    this.props.dataBig&&this.props.dataBig.forEach((item)=>{
      if(item.itemId>0 && item.typeId==typeId ){
        out.push(<Select.Option key={item.itemId} value={item.itemId} fill={item.itemId+"/"+item.itemName}>{item.itemName}/{item.itemId}</Select.Option> )
      }
    })
    return out
  }

  buildItemList=()=>{
    let out=[]
    this.props.dataBig&&this.props.dataBig.forEach((item)=>{
    if(item.itemId>0)
        out.push(<Select.Option key={item.itemId} value={item.itemId} fill={item.itemId+"/"+item.itemName}>{item.itemName}/{item.itemId}</Select.Option> )
    })
    return out
  }

  buildPropsButton=(data, index, key, text,rowId)=>{
    return (
      <span size={"small"} className="props-btn" onClick={()=>this.toggleExpandedRowKeys(data,index,text,rowId)}>
        <Icon type="paper-clip" />
      </span>
    )
  }
  expandedRowRender=(record)=><PropsTable data={ record.itemProps } editable={record._editable} onSave={(v)=>record.itemProps=v}/>


  toggleExpandedRowKeys=(data,index,text,rowId)=>{

    if(this.state.expandedRowKeys==null) this.state.expandedRowKeys=[]
    if(this.state.expandedRowKeys.indexOf(rowId)>-1 ) {
      this.state.expandedRowKeys.splice(this.state.expandedRowKeys.indexOf(rowId),1)
    }else{
      this.state.expandedRowKeys.push(rowId)
    }
 /*   let _found=false
    for(let i=0;i<this.state.expandedRowKeys.length;i++){
      let id=this.state.expandedRowKeys[i]
        if(id==text){
          this.state.expandedRowKeys.splice(i,1)
          i--
          _found=true
        }
    }
    if(!_found){
      this.state.expandedRowKeys.push(text)
    }*/
    this.setState({expandedRowKeys:this.state.expandedRowKeys})
  }
  handleChangeType=(data,index,value)=>{
    data[index].typeId=value
  }

  handleChangeParentId=(data,index,value)=>{
    if(value==="") value=null
    data[index].itemMainParentId=value
  }
  handleChangeBy=(data,index,key,value)=>{
    if(value.constructor ==Array){
      value=value.join(",")
    }
    data[index][key]=value
  }

  buildItemMainParentId=()=>{
   return <Select showSearch style={{ width: 100 }}  placeholder="选择栏目" optionFilterProp="children"
            onChange={(v)=>this.handleChangeParentId(data,index,v)}
            filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
      {this.buildTypeList()}
    </Select>
  }
  translate=(text)=>{
    let ori={
      itemId:"ID",
      typeId:"类型ID",
      itemMainParentId:"上级ID",
      itemBlockIds:"屏蔽ID",
      itemMultiParentIds:"多上级ID",
      itemName:"名称",
      itemShortName:"唯一名称",
      itemDesc:"描述",
      itemProps:"属性",
      operation:"操作"
    }
    return ori[text];
  }
  selectCurrentItem=(item)=>{
    if(this.props.selectCurrentItem){
      this.props.selectCurrentItem(item)
    }
  }

  hasDeletePermisssion=()=>{
    if(this.props.hasDeletePermisssion ){
      return this.props.hasDeletePermisssion()
    }
    return false
  }
  checkRequire=(obj)=>{
    if( obj.itemName==null ||obj.itemName==""){
      message.error('名称必填');
      return false
    }
    if(obj.itemShortName==null ||obj.itemShortName==""){
      message.error('缩写名必填');
      return false
    }
    for(let sk of this.props.data){
      if(sk.itemShortName==obj.itemShortName && sk.itemId!=obj.itemId){
        message.error('缩写名重复');
        return false
      }
    }
  }
  getEmptyObj=()=>{
    return [  { itemId:"",
      typeId:"",
      itemMainParentId:"",
      itemBlockIds:"",
      itemMultiParentIds:"",
      itemName:"",
      itemShortName:"",
      itemDesc:"",
    }]
  }
  findTypeParentId=(typeId)=>{
    for(let s of this.props.pimTypes){
      if(s.typeId==typeId){
        return s.typeMainParentId
      }
    }
  }

  renderColumns = (data, index, key, text) => {
    const {_editable, status} = data[index];
    if(key==="itemId"){
      if(data[index].itemId<0){
        return <span className="unsave-msg">未保存</span>
      }
    }

    if(key==="itemProps"){
      let rowId=data[index].itemId
      return this.buildPropsButton(data, index, key, text,rowId)
    }

    if (typeof _editable === 'undefined') {

      if (key === "typeId"){
        return this.buildTypeCol(text)
      }
      if(key ==="itemName"){
        //名称生成连接
        return <span><Link onClick={()=>this.selectCurrentItem(data[index])} to={"itemProps/"+data[index].itemShortName}>{text}</Link></span>
      }
      if(key ==="itemMainParentId"){
        return this.buildItemCol(text)
      }
      if(key==="itemMultiParentIds"){
        return this.buildMutlItemCol(text)
        //buildM
      }
      return <span>{text}</span>;
    } else {
      if (key === "itemId"){
        return <span>{text}</span>;
      }
      if (key === "typeId") {
       return(
         <Select allowClear={true} showSearch style={{ width: 100 }}  placeholder="选择分类" optionFilterProp="children" defaultValue={text||undefined}
                onChange={(v)=>this.handleChangeType(data,index,v)}
                filterOption={(input, option) => isStringLike(option.props.fill,input)}>
          {buildTypeList(this.props.pimTypes)}
        </Select>
       )
      }
      if(key ==="itemMainParentId"){
        return <SelectItemG slintId={this.findTypeParentId(data[index].typeId)} onChange={(v)=>this.handleChangeParentId(data,index,v)} defaultValue={text||undefined}/>
        return(
          <Select allowClear={true} showSearch style={{ width: 100 }}  placeholder="选择栏目" optionFilterProp="children" defaultValue={text||undefined}
                       onChange={(v)=>this.handleChangeParentId(data,index,v)}
                       filterOption={(input, option) => isStringLike(option.props.fill,input)}>
          {this.buildItemList()}
        </Select>)
      }
      if(key==="itemMultiParentIds"){
        return <SelectItem  onChange={(v)=>this.handleChangeBy(data,index,"itemMultiParentIds",v)}
                            multiple
                            tokenSeparators={[',']}
                            value={this.parseStringToArray(text)}/>
         return (
           <Select allowClear={true}
                   notFoundContent="暂无数据"
                   multiple
                   optionLabelProp="value"
                   style={{ width: '100%' }}
                   onChange={(v)=>this.handleChangeBy(data,index,"itemMultiParentIds",v)}
                   tokenSeparators={[',']}
                   defaultValue={this.parseStringToArray(text)}>
             {this.limitTypeBuildItemList(data[index].typeId)}
          </Select>
         )
      }
      if(key==="itemBlockIds"){
        return (
          <Select allowClear={true} multiple style={{ width: '100%' }} onChange={(v)=>this.handleChangeBy(data,index,"itemBlockIds",v)} tokenSeparators={[',']}
                  defaultValue={this.parseStringToArray(text)}>
            {this.buildItemList()}
          </Select>
        )
      }


      return (<EditableCell key={index} editable={_editable} value={text} onChange={value => this.handleChange(key, index, value)} />)


    }
  }
}
const isStringLike=(str,strb)=>{
  if(str!=null && strb!=null){
    if(str.constructor==Object){
      str=JSON.stringify(str)
    }
    if(strb.constructor==Object){
      strb=JSON.stringify(strb)
    }
    if(str.constructor==Number){
      str=str+""
    }
    if(str.constructor==strb.constructor){
      if(strb.constructor==String){
        if(str.toLowerCase().indexOf(strb.toLowerCase())>-1){
          return true
        }
      }
    }
  }
  if(str==null && strb==null){
    return true
  }
  return false
}
