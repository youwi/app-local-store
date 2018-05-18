/**
 * Created by yu on 2017/4/21.
 */
import {connect} from 'dva'
import  {Tooltip, Select,Collapse,Icon} from "antd"
import React from 'react';
import PropTypes from 'prop-types';

import {isStringLike} from "../../utils/ArrayUtil";
import {GroupSelect} from "../GroupSelect/GroupSelect";
const Panel = Collapse.Panel;

const {   OptGroup,Option } = Select;
const buildTypeCol = ({id, pimTypes}) => {
  for (let s of  pimTypes) {
    if (s.typeId == id) {
      return (
        <Tooltip key={id} title={<span className="nameid-fix-title">{s.typeShortName} id:{s.typeId}</span> }>
          <span className="nameid-fix">{s.typeName}</span>
        </Tooltip>
      )
    }
  }
  return null
}

const buildItemCol = ({id, allItem}) => {
  for (let s  of allItem) {
    if (s.itemId == id) {
      return (
        <Tooltip key={id} title={<span className="nameid-fix-title">{s.itemShortName} id:{s.itemId}</span> }>
          <span className="nameid-fix">{s.itemName}</span>
        </Tooltip>
      )
    }
  }
  return null
}
export const buildTypeList = (pimTypes) => {
  let out=[]
  pimTypes.map((item, i) =>{
    if(item.typeId>0)
      out.push(<Select.Option key={item.typeId} value={item.typeId}>{item.typeName}</Select.Option> )
  })
  return out
}
export const buildItemList = (allItem) => {
  let out=[]
  allItem.map((item) =>{
    if(item.itemId>0){
      out.push(<Select.Option key={item.itemId} value={item.itemId}>{item.itemName}/{item.itemId}</Select.Option>)
    }
  })
  return out
}


class OptGroupEx extends React.Component {
  static SelectOptGroup = true;
  render(){
    return this.props.children
  }
}
const buildSelectTypes = ({pimTypes, onChange, value}) => {
  return <Select allowClear={true} showSearch style={{width: 100}}
                 placeholder="选择分类"
                 optionFilterProp="children"
                 defaultValue={value}
                 onChange={onChange}
                 filterOption={(input, option) => isStringLike(option.props.fill, input)}>

    {pimTypes.map((item, i) => (<Select.Option key={item.typeId} value={item.typeId}>{item.typeName}</Select.Option>))}

  </Select>
}

const buildSelectItem = ({allItem, pimTypes,onChange, value,slintId,multiple,tokenSeparators}) => {
    let group=[]

    /*必须转换为字符串*/
    if(value&&value.constructor==String){
      value=value+""
    }
    /*带分组模式的*/
    for(let sk of pimTypes){
      let gitem=[]
      for(let it of allItem){ if(it.typeId==sk.typeId) gitem.push(it)}
      if(slintId!=null){
        if(slintId==sk.typeId){
          group.push(
            //<Icon type="check-circle"/>
            <OptGroup label={<span className="sel-gup"> {sk.typeName}</span>} key={sk.typeId}>
              { gitem.map((item)=><Select.Option key={item.itemId} value={item.itemId+""}>{item.itemName}/{item.itemId}</Select.Option>) }
            </OptGroup>
          )
        }
        continue
      }
      if(gitem.length>0){
        group.push(
          <OptGroup label={<span> {sk.typeName} </span>} key={sk.typeId}>
            { gitem.map((item)=><Select.Option key={item.itemId} value={item.itemId+""}>{item.itemName}/{item.itemId}</Select.Option>) }
          </OptGroup>
        )
      }
  }
  /*不带分组*/
  let allOp=allItem.map((item) => <Select.Option key={item.itemId} value={item.itemId+""}>{item.itemName}/{item.itemId}</Select.Option>)


  return <Select allowClear={true}
                 placeholder="选择分类"
                 showSearch
                 tokenSeparators={tokenSeparators||undefined}
                 multiple={multiple||undefined}
                 defaultValue={value}
                 onChange={onChange}
                 style={{width: 200}}>
                 {group}
      </Select>
}

const SelectGroupBy=({allItem,pimTypes,onChange,defaultValue,slintId})=>{

  let out=[]
  for(let g of pimTypes){
    let tmp={key:g.typeId,name:g.typeName,sub:[]}

    if(slintId!=null &&g.typeId!=slintId) continue
    for(let a of allItem){
      if(g.typeId==a.typeId){
        tmp.sub.push({key:a.itemId,value:a.itemName})
      }
    }
    if(tmp.sub.length>0){
      out.push(tmp)
    }
  }
  return <GroupSelect data={out} onChange={onChange} defaultValue={defaultValue||undefined}/>
}
const buildUserSelect=({allUsers,value,onChange,})=>{

  return <Select
                showSearch
                 allowClear={true}
                 placeholder="选择分类"
                 defaultValue={value||undefined}
                 onChange={onChange}
                 style={{width: 200}}
                 optionFilterProp="children"
                 filterOption={(input, option) => option.props.fill.toLowerCase().indexOf(input.toLowerCase()) >= 0}

               // filterOption={(input, option) => isStringLike(option.props.value, input)}>  // 注意预调用和预分组
    >
    {allUsers.map((item,i) => <Select.Option  key={item['display-name']+i} value={item['display-name']} fill={item['display-name']+item['name']}>{item['display-name']}/{item['name']}</Select.Option>)}
  </Select>
}

export const LabelType = connect(({typePage}) => ({...typePage}))(buildTypeCol)
export const SelectTypes = connect(({typePage}) => ({...typePage}))(buildSelectTypes)
export const LabelItem = connect(({itemPage}) => ({...itemPage}))(buildItemCol)
export const SelectItem = connect(({itemPage,typePage}) => ({...itemPage,...typePage}))(buildSelectItem)

export const SelectItemG = connect(({itemPage,typePage}) => ({...itemPage,...typePage}))(SelectGroupBy)
export const SelectUser=connect(({itemPage,typePage}) => ({...itemPage,...typePage}))(buildUserSelect)




