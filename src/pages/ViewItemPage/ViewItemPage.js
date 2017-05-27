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
import styles from './ViewItemPage.less'
import {color} from '../../utils'
import {Table,Popconfirm,Button} from "antd"
import  EditableTable from "../../components/EditableTable/EditableTable"
import EditableTableForType from "../../components/EditableTable/EditableTableForType";
import ViewTable from "../../components/EditableTable/ViewTable";
import EditableTableForItem from "../../components/EditableTable/EditableTableForItem";
import {randomString} from "../../utils/ArrayUtil";



 class ViewItemPage extends React.Component {
  state = {};

  componentDidMount=()=>{
    this.updateDataList(this.props.params.shortName)
  }
   componentWillReceiveProps(nextProps) {
      this.setState({data:nextProps.data})
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
     this.props.dispatch({type:"viewPage/commitSaveItem",item:obj})
   }
   giveNewItemByType=(typeId)=>{
     return {"itemId": Math.ceil(Math.random()*10000*-1),
       key:Math.ceil(Math.random()*10000*-1),
       "typeId": typeId,
       "itemMainParentId": null,
       "itemBlockIds": null,
       "itemMultiParentIds": null,
       "itemName": "" ,
       "itemShortName": null,//  randomString(8), //取消自动生成
       "itemDesc": "",
       "itemProps": this.getTplProps(typeId),
       _editable:true,
     }
   }

   getTplProps=(typeId)=>{
     if(this.props.pimTypes){
       for(let a of this.props.pimTypes){
         if(a.typeId==typeId)
           return a.typeProps
       }
     }
     return ""
   }

   addEmptyItemByType=()=>{
    let newitem=this.giveNewItemByType(this.getTypeIdByTypeShorName() )
     this.props.dispatch({type:"viewPage/addEmptyItem",item:newitem})
   }
   changeColList=(v)=>{
     if(v==null ||v.length==0){
       this.setState({colHideList:null})
     }
     this.setState({colHideList:v})
   }
   hasDeletePermisssion=()=>{
     if(this.props.permissionList===null) return false
     for(let s of this.props.permissionList){
       if(s.name==="DELETE"  ){
         return true
       }
     }
     return false
   }
   deleteItem=(item)=>{
     this.props.dispatch({type:"viewPage/commitDelete",item} )
   }


   buildShowTableCol=()=>{
     let tabCV={
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
     let ops=[]
     let options=[]
     for(let p in tabCV){
       if(p!=="itemProps" && p!=="typeId" && p!=="itemBlockIds"  && p!=="itemMultiParentIds"){
         ops.push(p)
       }

       options.push(<Option key={p}>{tabCV[p]}</Option>)
     }
     if(this.state.colHideList==null) this.state.colHideList=[...ops]
     if(this.state.colHideList.length==0) this.state.colHideList=null
     // return <Select multiple className="ftc-select" style={{ width: '100%' }}  placeholder="Please select"  defaultValue={ops}  onChange={this.changeColList}>
     //   {options}
     // </Select>
   }
   selectCurrentItem=(item)=>{
     // this.props.dispatch({type:"itemPage/getAllOperationByItem",itemId: item.itemId} )
     this.props.dispatch({type:"itemPage/getAllOperationByType",typeId: item.typeId})
     let currentType
     if(this.props.pimTypes)
       for(let tp of this.props.pimTypes){
         if(tp.typeId===item.typeId){
           currentType=tp
         }
       }
     this.props.dispatch({type:"itemPage/pureUpdate",currentItem:item,currentItemBackUp:item,currentType,currentTypeBackUp:currentType})
   }
   toggleDisableItem=(target,value)=>{
     let transToZero=(v)=>{
       if(v==true) return 1
       else return 0
     }
     this.props.dispatch({type:"viewPage/commitSaveItem",item:{...target,disabled:transToZero(value)} } )
   }
  render() {
    return (
      <div>
        <div>{this.buildShowTableCol()}</div>
        {this.hasPermission()?   <Button onClick={this.addEmptyItemByType}>添加</Button>:null}
        {/*<ViewTable data={this.props.data} onSave={this.saveOneItem} />*/}
        <EditableTableForItem
          hasDeletePermisssion={this.hasDeletePermisssion}
          colHideList={this.state.colHideList}
          dataBig={this.props.allItem}
          onDelete={this.deleteItem}
          data={this.props.data} onSave={this.saveOneItem}
          onToggleDisable={this.toggleDisableItem}
          pimTypes={this.props.pimTypes}
          selectCurrentItem={this.selectCurrentItem}
          permission={this.props.permissionList}/>
      </div>
    )
  }
}
export default connect(({viewPage,typePage,permission,itemPage}) => ({allItem:itemPage.allItem,permissionList:permission.permissionList,viewPage,data:viewPage.items,pimTypes:typePage.pimTypes}))(ViewItemPage)

