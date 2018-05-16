import React, {PropTypes} from 'react'
 import {Link} from 'dva/router'
import styles from './DeviceTable.less'
import _ from "lodash";
import {EditableTable} from "./EditableTable"
import {EditableCell} from "./EditableCell"
import styles2 from "./EditableTable.less"
import { Table, Input, Icon, Button, Popconfirm,Select,Radio } from 'antd';
const Option = Select.Option;

function onChange(pagination, filters, sorter) {
  console.log('params', pagination, filters, sorter);
}
export default class EnvIPList extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.filterList = [{key: "deviceName", value: ""}]

    this.state.dataSourceCache = []
    this.state.dataSourceCacheOrigin = []
  }

  componentWillReceiveProps(nextprops) {
    this.state.dataSourceCacheOrigin = nextprops.data;
    this.AllFilterMethod()
  }

  AllFilterMethod = () => {
    this.state.dataSourceCache = []
    for (let record of this.state.dataSourceCacheOrigin) {
      if (this.filterAllKey(this.state.filterList, record)) {
        this.state.dataSourceCache.push(record);
      }
    }
    this.setState({dataSourceCache: this.state.dataSourceCache})
  }
  filterAllKey = (allkeys, record) => {
    for (let item of  allkeys) {
      if (this.filterKey(item.value, record, item.key) == false) {
        return false;
      }
    }
    return true;
  }
  filterKey = (filterString, record, filed) => {
    filterString = filterString.toLowerCase();
    if(record[filed]==null) record[filed]="";
    let fullString = record[filed].toString().toLowerCase();
    if ((record[filed].constructor != String) && (fullString = record[filed].props != null)) {
      fullString = record[filed].props.children
    }
    if (fullString.indexOf(filterString) > -1)
      return true
    else return false
  }
  changeFilterValueByKey = (key, value) => {
    let affexed = 0
    for (let item of this.state.filterList) {
      if (item.key == key) {
        item.value = value;
        affexed = 1;
      }
    }
    if (affexed == 0) {
      this.state.filterList.push({key, value});
    }
  }
  findFilterValueByKey = (key) => {
    for (let item of this.state.filterList) {
      if (item.key == key) {
        return item.value;
      }
    }
    return null;
  }

  changeType = (e) => {
    this.changeFilterValueByKey("deviceModel", e.target.value);
    this.AllFilterMethod()
  }
  changeIdenty = (e) => {
    this.changeFilterValueByKey("deviceIdentity", e.target.value);
    this.AllFilterMethod()
  }
  changeDeviceName = (e) => {
    this.changeFilterValueByKey("deviceName", e.target.value);
    this.AllFilterMethod()
  }

  onCellChange = (index, key) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      this.setState({ dataSource });
    };
  }
  onDelete = (index) => {
    return () => {
      const dataSource = [...this.state.dataSource];
      dataSource.splice(index, 1);
      this.setState({ dataSource });
    };
  }
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  }
  handleSizeChange=()=>{
    this.state.dataSourceCacheOrigin.splice(0,0,this.giveARow());
    this.setState({dataSourceCacheOrigin:this.state.dataSourceCacheOrigin})
  }
  giveARow=()=>{
    return {
      envName:"",
      envId:0,
      moduleName:"",
      moduleShortName:"",
      moduleId:0,
      address:"10.0",
      port:0,
      remark:""
    }
  }
  render = () => {
    let tableHeight = document.body.clientHeight - 230;
    let columns = [{
        title: <span style={{fontFamily: "anticon"}}>
          <input placeholder={"\uE670" + " 环境名"} value={this.findFilterValueByKey("envName")} onChange={this.changeType}/>
         </span>,
        className: "th-search-input",
        dataIndex: 'envName',
        width: 220,
        render:(text,record,index)=>{
          let options=null;
           if(this.props.evnlist!=null)
              options=this.props.evnlist.map((item)=><Select.Option key={item.key}>{item.name}</Select.Option>)
          return <Select defaultValue={record.envName} style={{ width: 200 }} onChange={this.onCellChange} key={""+index}>
            {options}
          </Select>}
       },
      {
        title: <span style={{fontFamily: "anticon"}}>
        <input placeholder={"\uE670" + " 模块名"} value={this.findFilterValueByKey("moduleShortName")} onChange={this.changeType}/>
       </span>,
        width: 350,
        className: "th-search-input",
        dataIndex: 'moduleShortName',
        render:(text,record,index)=>{
          let options=null;
          if(this.props.totalmodlist!=null)
             options=this.props.totalmodlist.map((item)=><Select.Option key={item.moduleShortName+" " +index+" "+item.id}>{item.id+":"+item.moduleName+"("+(item.moduleShortName||"?")+")"}</Select.Option>);
         return <Select
                defaultValue={record.id}
               showSearch
               style={{ width: 200 }}
               placeholder="Select a person"
               optionFilterProp="children"
               onChange={this.onCellChange}
               filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
             >
              {options}
            </Select>
       }
      },
      {
        title: <span style={{fontFamily: "anticon"}}>
          <input placeholder={"\uE670" + " IP"} value={this.findFilterValueByKey("address")} onChange={this.changeType}/>
        </span>,
        className: "th-search-input",
        dataIndex: 'address',
        width: 270,
        render: (text, record, index) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(index, 'name')}
          />
        ),
      }
      , {
        title: <span style={{fontFamily: "anticon"}}>
          <input placeholder={"\uE670" + " 端口"} value={this.findFilterValueByKey("port")} onChange={this.changeType}/>
        </span>,
        width: 150,
        className: "th-search-input",
        dataIndex: 'port',
        render: (text, record, index) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(index, 'name')}
          />
        ),
      },
      {
        title: <span style={{fontFamily: "anticon"}}>
          <input placeholder={"\uE670" + " 描述"} value={this.findFilterValueByKey("remark")} onChange={this.changeType}/>
        </span>,
        dataIndex: 'remark',
        className: "th-search-input",
        width: 150,
        render: (text, record, index) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(index, 'name')}
          />
        ),
      },
    ];


    return (
      <div className={styles.device+ " " +styles2.editableTable}>
        <div style={{background: 'rgba(236, 236, 236, 0)', padding: '10px 0'}}>
          <Radio.Group value={"small"} onChange={this.handleSizeChange} style={{padding:"8px 0px"}}>
            <Radio.Button value="large">Add</Radio.Button>
            <Radio.Button value="default">提交</Radio.Button>
          </Radio.Group>
          <Table columns={columns}
                 scroll={{y: tableHeight}}
                 pagination={false}
                 dataSource={this.state.dataSourceCache} onChange={onChange} size="small"/>
         </div>
      </div>
    )
  }
}
