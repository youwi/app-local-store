import React from 'react';
import PropTypes from 'prop-types';

import {Menu, Icon, Button, Row, Col, Card} from 'antd'
import {Link} from 'dva/router'
import styles from './RealTimeTable.less'
import _ from "lodash";
import DragHandler from "./DragHandler"
import {Table} from 'antd';
import { TypesList,whichTypeAs,TypesNameList} from "./mineTypes"

let urlwidth = 350;
export default class RealTimeTable extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.protocolString = ''
    this.state.urlString=''
    this.state.hostString=''
    this.state.typeString=""
    this.state.serverString=''
    this.state.dataSourceCache = []
    this.state.dataSourceCacheOrigin = []
  }

  doDragReach = (offset) => {
    urlwidth += offset;
    this.forceUpdate();
  }


  onChange = (pagination, filters, sorter) => {
    console.log('params', pagination, filters, sorter);
  }
  changeProtocol = (e) => {this.state.protocolString= e.target.value;this.AllFilterMethod()}
  changeHost     = (e) => {this.state.hostString= e.target.value;this.AllFilterMethod()}
  changeUrl      = (e) => {this.state.urlString= e.target.value;this.AllFilterMethod()}
  changeServer   = (e) => {this.state.serverString= e.target.value;this.AllFilterMethod()}
  changeType     = (e) => {this.state.typeString=e.target.value;this.AllFilterMethod()}

  componentWillReceiveProps(nextprops) {
    this.state.dataSourceCacheOrigin = nextprops.realtimeList;
    this.AllFilterMethod()
  }

  AllFilterMethod = () => {
    this.state.dataSourceCache = []
    for (let record of this.state.dataSourceCacheOrigin) {
      if (
           this.filterProtocol(this.state.protocolString, record)
        && this.filterKey(this.state.hostString,record,"host")
        && this.filterKey(this.state.urlString,record,"url")
        && this.filterKey(this.state.serverString,record,"server")
        && this.filterKey(this.state.typeString,record,"responseType")
      ) {
        this.state.dataSourceCache.push(record);
      }
    }
    this.setState({dataSourceCache: this.state.dataSourceCache})
  }

  filterProtocol = (filterString, record) => {
    if (filterString == 'protocol' || filterString == '') return true;
    filterString = filterString.toLowerCase();
    let fullString = record.protocol.toLowerCase();
    if (fullString.indexOf(filterString) > -1)
      return true
    else return false
  }

  filterKey = (filterString, record, filed) => {
    filterString = filterString.toLowerCase();
    let fullString=""
    if(record[filed] && record[filed].constructor==Object )
        fullString=JSON.stringify(record[filed])
    else
        fullString = record[filed].toLowerCase();
    if (fullString.indexOf(filterString) > -1)
      return true
    else return false
  }

  render = () => {
    let columns = [
      {
        title: "#",
        dataIndex: 'id',
        width: 50,
        className: "sp-th",
        sorter: (a, b) => a.id-b.id,
      },
      {
        title: 'Code',
        width: 50,
        dataIndex: 'responseCode',
      },

      {
      //  title: <input placeholder="Protocol" value={this.state.protocolString} onChange={this.changeProtocol}/>,
        title:"Protocol",
        className: "th-protocol",
        width: 80,
        dataIndex: 'protocol',
       /* filters: [{text: 'HTTP', value: 'HTTP',}, {text: 'HTTPS', value: 'HTTPS',}],
        filterMultiple: false,
        onFilter: this.filterProtocol
*/      }
      , {
        title: <input placeholder="Host" value={this.state.hostString} onChange={this.changeHost}/>,
        className: "th-search-input host",
        width: 100,
        dataIndex: 'host',
        sorter: (a, b) => a.host - b.host,
      },
      {
    /*    title: <DragHandler reachData={this.doDragReach}>
          <input placeholder="URL" value={this.state.urlString} onChange={this.changeUrl}/>
        </DragHandler>,*/
        title:<input placeholder="URL" value={this.state.urlString} onChange={this.changeUrl}/>,
        className: "th-search-input resize-handler-parent url-col",
        width: urlwidth,
        dataIndex: 'url',
      //   sorter: (a, b) => a.url > b.url,
      },
      {
        title: <input placeholder="Type" value={this.state.typeString} onChange={this.changeType}/>,
        width: 80,
        dataIndex: 'responseType',
        className: "th-search-input",
        render:(mimeType,record)=>{
          return <span>{whichTypeAs(mimeType)} </span>
        }
        // filters: TypesNameList(),
       },
      {
        title: <input placeholder="Server" value={this.state.serverString} onChange={this.changeServer}/>,
        className: "th-search-input",
        width: 150,
        dataIndex: 'server',
     //   sorter: (a, b) => a.server> b.server,
      },
      {
        title: 'Rule',
        width: 80,
        dataIndex: 'rule',
     //   sorter: (a, b) => a.rule > b.rule,
        render:(text,record)=>{
          if(record.ruleTips==null){
            if(text==null||text=="")
              return "..."
            else return "mocked"
          }
          return record.ruleTips
        }
      },
    ];
    const calcContentHeight=()=>{
      let contentHeight="";
      if(document.body.clientHeight>900)
        contentHeight="calc(100vh - 210px)"
      else
        contentHeight="calc(100vh - 210px)"
      return contentHeight;
    }
    //kk.scrollTop= kk.scrollHeight

    let scrollStyle=""
    if(this.state.dataSourceCache && this.state.dataSourceCache.length>30)
        scrollStyle="myScroll2"
    return (
      <div className={styles.realtime}>
        <div style={{background: 'rgba(236, 236, 236, 0)', padding: '10px 0'}} className={scrollStyle}>
          <Table columns={columns}
                 scroll={{ y: calcContentHeight() }}
                 dataSource={this.state.dataSourceCache}
                 onChange={this.onChange}
                 size="small"
                 onRowClick={this.props.rowClick}
                 pagination={false}
                 rowClassName={(record) => "toa-" + record.active}
          />
        </div>
      </div>
    )
  }
}
RealTimeTable.propTypes = {
  cardList: PropTypes.array
}
//    <Button shape="circle" icon="setting"  />
//   {/*<Card title={card.projectName} bordered={false}>{card.projectDesc}</Card>*/}
/*
 let rule=JSON.parse(text||"{}");
 let ruleMsg="static"
 let bstyle={ }
 if(rule.id==this.props.currentRule.id && this.props.showRuleConfigPanel)   bstyle={ background: "blue",color:"white"}
 if(rule.ruleContent) ruleMsg="static"
 if(text==null||text=="") ruleMsg=""
<span style={bstyle} className="figg-button"  onClick={ (e)=>{
  e.stopPropagation&&e.stopPropagation();
  this.props.toggleRulePanel(record)
}}>
            {ruleMsg}
  <Icon type="setting"   />
          </span>*/
