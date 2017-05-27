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
import styles from './PimMapPage.less'
import {color} from '../../utils'
import {Table,Popconfirm,Button,Tabs,} from "antd"
import  EditableTable from "../../components/EditableTable/EditableTable"
import EditableTableForType from "../../components/EditableTable/EditableTableForType";
import MindChart from "../../components/MindChart/MindChart";
import MindChartFlod from "../../components/MindChart/MindChartFlod";
import MultiMindChart from "../../components/MindChart/MultiMindChart";
import RaTable from "../../components/RaTable/RaTable";
import RaTableMe from "../../components/RaTable/RaTableMe";
import {buildSSCData} from "./ShareBuildFun";
const TabPane = Tabs.TabPane;

 class PimMapPage extends React.Component {
  state = {};

  componentDidMount=()=>{

  }
   componentWillReceiveProps(nextProps) {
      this.setState({data:nextProps.data})

      //交叉节点
      this.state.SSC4Cross=buildSSCData(nextProps.itemPage.allItem,true)
      //网状相同的节点,
      this.state.SSC4Grid=buildSSCData(nextProps.itemPage.allItem)
      //复制相同的节点
      this.state.SSC4Copy=buildSSCData(nextProps.itemPage.allItem,true)
   }
   handleChange=()=>{

   }
   saveOneItem=(obj)=>{
     this.props.dispatch({type:"typePage/commitSaveType",item:obj,id:obj.typeId})
   }
   addEmptyItem=()=>{
     this.props.dispatch({type:"typePage/addEmptyType"})
   }
   hasPermission=()=> {
     if (this.props.permissionList === null) return false
     for (let s of this.props.permissionList) {
       if (s.name === "UPDATE" || s.name === "ADD" || s.name === "DELETE") {
         return true
       }
     }
     return false
   }

   fillDeep=()=>{

   }
   onTabChange=()=>{

   }

   render() {
     return (
       <div>
         <Tabs defaultActiveKey="2" onChange={this.onTabChange}>
           {/*<TabPane tab="展开表" key="1"><RaTable types={this.props.pimTypes} data={this.props.itemPage.allItem}/></TabPane>*/}
           <TabPane tab="展开图" key="4"><MindChart data={this.state.SSC4Copy}/></TabPane>
           <TabPane tab="折叠图" key="2"><MindChartFlod data={this.state.SSC4Copy}/></TabPane>
           <TabPane tab="网状图" key="3"><MultiMindChart data={this.state.SSC4Grid} /></TabPane>
         </Tabs>
         {/*<RaTableMe types={this.props.pimTypes} data={this.props.itemPage.allItem}/>*/}
       </div>
     );
   }




 }
export default connect(({typePage,permission,itemPage,  }) => ({itemPage,permissionList:permission.permissionList,typePage,pimTypes:typePage.pimTypes}))(PimMapPage)

