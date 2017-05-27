import React, {PropTypes} from 'react'
import {connect} from 'dva'
import {Link} from 'dva/router'
import {Row, Col, Icon, Card,Select} from 'antd'
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
import styles from './OperationManage.less'
import {color} from '../../utils'
import {Table,Popconfirm,Button} from "antd"
const Option=Select.Option
import EditableTableForOperation from "../../components/EditableTable/EditableTableForOperation";
import {GroupSelect} from "../../components/GroupSelect/GroupSelect";
import {SelectItemG} from "../../components/EditableTable/ShareMod";


 class OperationManagePage extends React.Component {
  state = {
    operationList:[]
  };

  componentDidMount=()=>{
    this.props.dispatch&&this.props.dispatch({type:'operation/getAllOperation'})
    this.updateDataList(this.props.params.shortName)
  }
   componentWillReceiveProps(nextProps) {
      this.setState({data:nextProps.data,operationList:nextProps.operationList})
      if(this.props.params.shortName!==nextProps.params.shortName)
          this.updateDataList(nextProps.params.shortName)
   }
   getTypeIdByTypeShorName=(shortName)=>{
     /* this.props.params.shortName */
     for(let t of this.props.pimTypes){
       if(t.typeShortName==this.props.params.shortName)
         return t.typeId
     }

   }
   updateDataList=(shortName)=>{
      this.props.dispatch({type:'viewPage/getAllItemsByTypeShortName',shortName})
   }
   hasPermission=()=>{
     if(this.props.permissionList===null) return false
     for(let s of this.props.permissionList){
       if(s.name==="UPDATE" || s.name==="ADD" || s.name==="DELETE"){
         return true
       }
     }
     return false
   }

   saveOneItem=(obj)=>{
     this.props.dispatch({type:"operation/commitSaveOperation",op:obj})
   }
   addEmptyItemByType=()=>{
     let operation={
       "opId": -1*Math.floor( Math.random()*10000),
       "opItem": "",
       "opType": "",
       "opState": 0,
       "opName": "",
       "opTime": "",
       "updateTime": "",
       _editable:true
     }
     this.props.dispatch({type:"operation/addTmpOperation",operation})
     this.props.dispatch({type:"operation/currUpdateId",currUpdateId:operation.opId})

   }
   changeColList=(v)=>{
     if(v==null ||v.length==0){
       this.setState({colHideList:null})
     }
     this.setState({colHideList:v})
   }
   deleteOne=(op)=>{
     this.props.dispatch({type:"operation/commitDeleteOperation",id:op.opId})
   }
   buildShowTableCol=()=>{
     let tabCV={
       "opId": "ID",
       "opItem": "栏目ID",
       "opType": "类型ID",
       "opState": "完成状态",
       "opName": "操作名称",
       "opTime": "时间",
       "updateTime": "更新时间",
       operation:"操作",
       loading:"",
       "key":"key(tmp)"
     }

     let ops=[]
     let options=[]
     for(let p in tabCV){
       if(p!="opTime" && p!="updateTime" && p!="opState" && p!="opItem"){ops.push(p)}
       options.push(<Option key={p}>{tabCV[p]}</Option>)
     }
     if(this.state.colHideList==null) this.state.colHideList=[...ops]
     if(this.state.colHideList.length==0) this.state.colHideList=null
     // return <Select multiple className="ftc-select" style={{ width: '100%' }}  placeholder="Please select"  defaultValue={ops}  onChange={this.changeColList}>
     //   {options}
     // </Select>
   }
   buildSubGroupSelect=()=>{
     let allItem =this.props.allItem
     let pimTypes=this.props.pimTypes
     let out=[]
     for(let g of pimTypes){
       let tmp={key:g.typeId,name:g.typeName,sub:[]}

       for(let a of allItem){
         if(g.typeId==a.typeId){
           tmp.sub.push({key:a.itemId,value:a.itemName})
         }
       }
       if(tmp.sub.length>0){
         out.push(tmp)
       }
     }
     return out
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
  render() {

    return (
      <div>
        {/*<SelectItemG/>*/}
        {this.props.currUpdateId}
        <div>{this.buildShowTableCol()}</div>
        {this.hasPermission()?   <Button onClick={this.addEmptyItemByType}>添加</Button>:null}
        {/*<ViewTable data={this.props.data} onSave={this.saveOneItem} />*/}
        <EditableTableForOperation colHideList={this.state.colHideList}
                                   data={this.state.operationList}
                                   onSave={this.saveOneItem}
                                   onDelete={this.deleteOne}
                                   allItem={this.props.allItem||[]}
                                   pimTypes={this.props.pimTypes}
                                   permission={this.props.permissionList}
                                   isCanDelete={this.hasDeletePermission()}/>
      </div>

    )
  }
}
export default connect(({itemPage, typePage,permission,operation}) => ({
  operation,
  itemPage,
  allItem:itemPage.allItem,
  operationList:operation.operationList,
  permissionList:permission.permissionList,
  pimTypes:typePage.pimTypes,
  currUpdateId:permission.currUpdateId
}))(OperationManagePage)

