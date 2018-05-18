import React from 'react';
import PropTypes from 'prop-types';

import {Menu, Icon, Button, Row, Col, Table,Card} from 'antd'
import {Link} from 'dva/router'
import styles from './DeviceTable.less'
import _ from "lodash";

import moment from "moment"
moment.locale('zh-cn');

function onChange(pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter);
}
export default class DeviceTable extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.search={deviceName:"",deviceModel:"",deviceIdentity:""}

    this.state.dataSourceCache = []
    this.state.dataSourceCacheOrigin = []
  }
  componentWillReceiveProps(nextprops) {
    this.state.dataSourceCacheOrigin = nextprops.deviceList;
    this.AllFilterMethod()
  }
  AllFilterMethod=()=>{
    this.state.dataSourceCache = []
    for (let record of this.state.dataSourceCacheOrigin) {
      if (
           this.filterKey(this.state.search.deviceName,record,"deviceName")
        && this.filterKey(this.state.search.deviceModel,record,"deviceModel")
        && this.filterKey(this.state.search.deviceIdentity,record,"deviceIdentity")
      ) {
        this.state.dataSourceCache.push(record);
      }
    }
    this.setState({dataSourceCache: this.state.dataSourceCache})
  }
  filterKey = (filterString, record, filed) => {
    if(record[filed]==null) return true;
    filterString = filterString.toLowerCase();
    let fullString = null
    if(record[filed].constructor ==String ){
      fullString= record[filed].toString().toLowerCase();
    }
    if((record[filed].constructor!=String) && (fullString=record[filed].props!=null)){
        fullString=record[filed].props.children
    }
    if (fullString.indexOf(filterString) > -1)
      return true
    else return false
  }
    changeType      =(e)=>{this.state.search.deviceModel= e.target.value;this.AllFilterMethod()}
    changeIdenty    =(e)=>{this.state.search.deviceIdentity= e.target.value;this.AllFilterMethod()}
    changeDeviceName =(e)=>{this.state.search.deviceName= e.target.value;this.AllFilterMethod()}



      render = () => {
    let tableHeight = document.body.clientHeight - 230;
    let columns = [{
      title: <span style={{fontFamily: "anticon"}}>
        <input placeholder={"\uE670"+" 类型"} value={this.state.search.deviceModel} onChange={this.changeType}/>
       </span>,
      className:"th-search-input",
      dataIndex: 'deviceModel',
      width: 120,

    },
      {
        title:<span style={{fontFamily: "anticon"}}>
            <input placeholder={"\uE670"+" 设备ID"}  value={this.state.search.deviceIdentity} onChange={this.changeIdenty}/>
          {/*<Icon type="search" style={{position: "absolute",marginLeft: "-18px",color: "#ccc",top: "10px"}}/>*/}
        </span>,
         width: 350,
        className:"th-search-input",
        dataIndex: 'deviceIdentity',
      },

      {
        title: <span style={{fontFamily: "anticon"}}>
          <input placeholder={"\uE670"+" 设备名"} value={this.state.search.deviceName} onChange={this.changeDeviceName}/></span>,
        className:"th-search-input",
        dataIndex: 'deviceName',
        width: 70,

      }
      , {
        title: '配置日期',
        width: 150,
        dataIndex: 'updateDate',
        render:(text)=>{
          if(text==null|| text=="") return "";
         return moment(new Date(text)).fromNow();
        }
      },
      {
        title: '最近配置人',
        width: 150,
        dataIndex: 'deviceCurrentUser',
      },
    ];


    return (
      <div className={styles.device}>
        <div style={{background: 'rgba(236, 236, 236, 0)', padding: '10px 0'}}>

          <Table columns={columns}
                 scroll={{y: tableHeight}}
                 pagination={false}
                 dataSource={this.state.dataSourceCache} onChange={onChange} size="small"/>


        </div>
      </div>
    )
  }
}

DeviceTable.propTypes = {
  cardList: PropTypes.array
}
//                 scroll={{y:800}}

//   {/*<Card title={card.projectName} bordered={false}>{card.projectDesc}</Card>*/}

