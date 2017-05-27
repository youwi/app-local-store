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
import styles from './PimItemPage.less'
import {color} from '../../utils'
import {Table,Button,Select} from "antd"
import  EditableTable from "../../components/EditableTable/EditableTable"
import EditableTableForItem from "../../components/EditableTable/EditableTableForItem";
import DragSortPanel from "../../components/DragSortPanel/DragSortPanel";
import {randomString} from "../../utils/ArrayUtil";
const Option=Select.Option

 class PimItemPage extends React.Component {
  state = {
    collapsed: false,
  };

  componentDidMount=()=>{

  }
   saveOneItem=(obj)=>{
    this.props.dispatch({type:"itemPage/commitSaveItem",item:obj})
   }
   addEmptyItem=()=>{

       let newitem= {"itemId": Math.ceil(Math.random()*10000*-1),
         key:Math.ceil(Math.random()*10000*-1),
         "typeId": null,
         "itemMainParentId": null,
         "itemBlockIds": null,
         "itemMultiParentIds": null,
         "itemName": "",
         "itemShortName": null ,// randomString(8),
         "itemDesc": "",
         "itemProps": null,
         _editable:true,
       }

     this.props.dispatch({type:"itemPage/addEmptyItem",item:newitem})
   }
   hasPermission=()=>{
     if(this.props.permissionList===null) return false
     for(let s of this.props.permissionList){
       if(s.name==="UPDATE" || s.name==="ADD" ){
         return true
       }
     }
     return false
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
   deleteItem=(item)=>{
     this.props.dispatch({type:"itemPage/commitDelete",item} )
   }
   changeColList=(v)=>{
     if(v==null ||v.length==0){
       this.setState({colHideList:null})
     }
     this.setState({colHideList:v})
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
       if(p!=="itemProps"
         && p!=="itemBlockIds"
        // && p!=="itemMultiParentIds"
       ){
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


   toggleDisableItem=(target,value)=>{
    let transToZero=(v)=>{
      if(v==true) return 1
      else return 0
    }
     this.props.dispatch({type:"itemPage/commitSaveItem",item:{...target,disabled:transToZero(value)} } )
   }

   render() {


    return (
      <div>
        <div>{this.buildShowTableCol()}</div>
        {this.hasPermission()?   <Button onClick={this.addEmptyItem}>添加</Button>:null}
        <EditableTableForItem dataBig={this.props.allItem}
                              colHideList={this.state.colHideList}
                              data={this.props.allItem}
                              onSave={this.saveOneItem}
                              pimTypes={this.props.typePage.pimTypes}
                              permission={this.props.permissionList }
                              selectCurrentItem={this.selectCurrentItem}
                              onToggleDisable={this.toggleDisableItem}
                              hasDeletePermisssion={this.hasDeletePermission}
                              onDelete={this.deleteItem}
        />
        {/*<DragSortPanel data={data}/>*/}
      </div>
    )
  }
}
export default connect(({itemPage,typePage,permission,}) => ({permissionList:permission.permissionList,typePage,itemPage,allItem:itemPage.allItem}))(PimItemPage)
