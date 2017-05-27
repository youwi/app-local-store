import React, {PropTypes} from 'react'
import {connect} from 'dva'
import {Link} from 'dva/router'
import {Row, Col, Icon, Card} from 'antd'
import NumberCard from '../../components/dashboard/numberCard'
import Quote from '../../components/dashboard/quote'
import Sales from '../../components/dashboard/sales'
import Weather from '../../components/dashboard/weather'
import RecentSales from '../../components/dashboard/recentSales'
import Comments from '../../components/dashboard/comments'
import Completed from '../../components/dashboard/completed'
import Browser from '../../components/dashboard/browser'
import Cpu from '../../components/dashboard/cpu'
import User from '../../components/dashboard/user'
import styles from './PimTypePage.less'
import {color} from '../../utils'
import {Table, Popconfirm, Button,Select} from "antd"
import  EditableTable from "../../components/EditableTable/EditableTable"
import EditableTableForType from "../../components/EditableTable/EditableTableForType";
import QueryPreview from "../../components/QueryPreview/QueryPreview";
import request from "../../utils/request";
import * as config from "../../../config";

const Option=Select.Option
class PimTypePage extends React.Component {
  state = {};

  componentDidMount = () => {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: nextProps.data})
  }

  handleChange = () => {

  }
  saveOneItem = (obj) => {
    this.props.dispatch({type: "typePage/commitSaveType", item: obj, id: obj.typeId})
  }
  addEmptyItem = () => {
    this.props.dispatch({type: "typePage/addEmptyType"})
  }
  deleteType=(type)=>{
    this.props.dispatch({type: "typePage/commitDeleteType",typeId:type.typeId})
  }
  hasPermission = () => {
    if (this.props.permissionList === null) return false
    for (let s of this.props.permissionList) {
      if (s.name === "UPDATE" || s.name === "ADD" || s.name === "DELETE") {
        return true
      }
    }
    return false
  }


  changeSearch = (v) => {
    this.setState({search: v})
    this.changeViewData();
  }
  changeViewData = () => {
    let out = {}
    let listOut = []
    if (this.props.data != null && this.props.data.length > 0) {
      for (let s in this.props.data[0]) {
        out[s] = s
        listOut.push({key: s, value: s})
      }
      for (let s of this.props.data) {
        if (s.itemProps || s.typeProps) {
          let arr = JSON.parse(s.itemProps || s.typeProps)
          for (let i of arr) {
            listOut.push({key: i.key, value: i.key})
          }
        }
      }
    }
    this.props.dispatch({type: "tocPage/pureUpdate", kvList: listOut})
    return listOut
  }
  changeColList=(v)=>{
    if(v==null ||v.length==0){
      this.setState({colHideList:null})
    }
    this.setState({colHideList:v})
  }
  selectCurrentType=(tp)=>{
    this.props.dispatch&& this.props.dispatch({type:"typePage/pureUpdate",currentType:tp,currentTypeBackUp:tp})
  }
  buildShowTableCol=()=>{
    let tabCV={
      typeId:"ID",
      typeMainParentId:"上级类型",
      typeName:"名称",
      typeShortName:"唯一名称",
      typeDesc:"描述",
      typeProps:"属性",
      operation:"操作",

    }
    let ops=[]
    let options=[]
    for(let p in tabCV){
      if(p!="typeProps"){
        ops.push(p)
      }

      options.push(<Option key={p}>{tabCV[p]}</Option>)
    }
    if(this.state.colHideList==null) this.state.colHideList=[...ops]
    if(this.state.colHideList.length==0) this.state.colHideList=null
    // return <Select className="ftc-select" multiple  style={{ width: '100%' }}  placeholder="Please select"  defaultValue={ops}  onChange={this.changeColList}>
    //   {options}
    // </Select>
  }
  hasDeletePermission=()=>{
    if(this.props.permissionList===null) return false
    for(let s of this.props.permissionList){
      if(s.name==="DELETE"  ){
        return true
      }
    }
    return false
  }
  toggleDisableType=(target,value)=>{
    let transToZero=(v)=>{
      if(v==true) return 1
      else return 0
    }
    this.props.dispatch({type:"typePage/commitSaveType",item:{...target,disabled:transToZero(value)} } )
  }


  render() {

    return (
      <div>
        <div>{this.buildShowTableCol()}</div>

        {this.hasPermission() ? <Button onClick={this.addEmptyItem}>添加</Button> : null}
        <EditableTableForType
          colHideList={this.state.colHideList}
          data={this.props.data}
          onSave={this.saveOneItem}
          permission={this.props.permissionList}
        //  changeSearch={this.changeSearch}
          selectCurrentType={this.selectCurrentType}
          hasDeletePermission={this.hasDeletePermission}
          onDelete={this.deleteType}
          onToggleDisable={this.toggleDisableType}
        />
      </div>
    )
  }
}
export default connect(({typePage, permission,}) => ({permissionList: permission.permissionList, typePage, data: typePage.pimTypes}))(PimTypePage)
// {title: 'ID',dataIndex: 'typeId',key: 'typeId',render:this.renderId},
// {title: 'typeName',dataIndex: 'typeName',key: 'typeName',render:this.renderName},
// {title: 'typeShortName',dataIndex: 'typeShortName',key: 'typeShortName',render:this.renderShortName},
// {title: 'typeDesc',dataIndex: 'typeDesc',key: 'typeDesc',render:this.renderDesc},
// {title: 'operation',dataIndex: 'operation',render: this.renderButton}
//   renderId=(text, record, index)=>{
// return this.renderColumns(this.state.data, index, 'typeId', text)
// }
// renderName=(text, record, index)=>{
//   return this.renderColumns(this.state.data, index, 'typeName', text)
// }
// renderShortName=(text, record, index)=>{
//   return this.renderColumns(this.state.data, index, 'typeShortName', text)
// }
// renderDesc=(text, record, index)=>{
//   return this.renderColumns(this.state.data, index, 'typeDesc', text)
// }
// lt=this.state.data.map((item, i)=>(
//   <div key={i}>
//     <span>{item.typeId}</span>
//     <span>{item.typeName}</span>
//     <span>{item.typeShortName}</span>
//     <span>{item.typeDesc}</span>
//   </div>
// ))
// <Popconfirm title="Sure to cancel?" onConfirm={() => this.editDone(this.state.data,index, 'cancel')}>
// <a>Cancel</a>
// </Popconfirm>
