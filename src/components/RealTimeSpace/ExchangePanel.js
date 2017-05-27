import React, {PropTypes} from 'react'
import {Menu, Icon, Button, Row, Col, Card, Input,Tabs,Tooltip,Switch,Radio} from 'antd'
import {Link} from 'dva/router'
import styles from './RealTimeTable.less'
import _ from "lodash";
import {Table} from 'antd';

import JsonViewM2 from "../JsonViewM2/JsonViewM2"
import  Animate  from 'rc-animate';


function isEmptyObject(e) {
  let t;
  for (t in e)
    return !1;
  return !0
}
export default class ExchangePanel extends React.Component {
//export default function ExchangePanel({entry,changing}) {
  constructor() {
    super()
    this.state = {}
    this.state.local_showothers = false
    this.state.local_showothersResponse = false
    this.state.expand_content = false
    this.state.viewTypeRequest="raw"
    this.state.viewTypeResponse="raw"

  }

  toggleShowOthers = () => {
    this.setState({local_showothers: !this.state.local_showothers})
  }
  toggleShowOthersResponse = () => {
    this.setState({local_showothersResponse: !this.state.local_showothersResponse})
  }
  toggleExpandContent = () => {
    this.setState({expand_content: !this.state.expand_content})
  }
  changePanel = () => {

  }
  isEmtpyHar=(entry)=>{
    if (entry.request == null) {
      entry.request = {}
      entry.request.headers = [];
    }

    if (entry.response == null) {
      entry.response = {}
      entry.response.headers = [];
      entry.response.content = {};
    }
    if(entry.request.headers==null){
      entry.request.headers=[]
    }
    if(entry.response.headers==null){
      entry.response.headers=[]
    }
    if(entry.response.content==null){
      entry.response.content={}
    }
    if( entry.request.postData==null){
      entry.request.postData={}
    }
  }

  changeRawViewRequest=(e)=>{
    if(e.target)
     this.setState({viewTypeRequest:e.target.value})
  }
  changeRawViewResponse=(e)=>{
    if(e.target)
      this.setState({viewTypeResponse:e.target.value})
  }

  render = () => {

    let entry = this.props.entry
    let changing = this.props.changing
    if (isEmptyObject(entry)) {
      return null
      //return <div  style={{padding: "10px 0",border:"1px solid #e9e9e9",  marginTop: "10px"}}> </div>
    }

    this.isEmtpyHar(entry)

    let slstyle = {display: this.state.local_showothers ? "block" : "none", background: "rgba(119, 124, 173, 0.06)"}
    let sbstyle = {
      display: this.state.local_showothersResponse ? "block" : "none",
      background: "rgba(119, 124, 173, 0.06)"
    }
    let content_text = entry.response.content.text;
    if (this.state.expand_content) {
      try {
        content_text = JSON.stringify(JSON.parse(content_text), null, 4);
      } catch (e) {
        console.log(e)
        content_text = "ERROR"
      }
    }
    let contentStyle={
      borderTop: "solid 1px #e9e9e9",
     // whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      width: "calc(100% - 30px)",
      display: "inline-block",
      wordWrap: "break-word",
      paddingLeft:"5px"
    }
    let rightButtonStyle={
        float: "right",
        paddingRight: "10px",
        fontWeight: 400,
        paddingLeft: "10px"
    }
    let titleStyle={
      fontWeight: 800,
    //  borderTop: "solid #e9e9e9 4px",
      padding:"3px 0px",
      lineHeight:"30px"
    }

    let rawViewDomRequestJson=<div><JsonViewM2 text={entry.request.postData.text}/></div>
    let rawViewDomResponseJson=<div><JsonViewM2 text={content_text}/></div>

    let requestTitle=
      <div style={titleStyle}>Request <Icon type="bulb" onClick={this.toggleShowOthers}/>
        <Radio.Group defaultValue={this.state.viewTypeRequest} style={rightButtonStyle} onChange={this.changeRawViewRequest} key={new Date().getTime()}>
          <Radio.Button value="raw">Raw</Radio.Button>
          <Radio.Button value="json">Json</Radio.Button>
        </Radio.Group>
      </div>
    let responseTitle=
      <div style={titleStyle}>Response <Icon type="bulb" onClick={this.toggleShowOthersResponse}/>
        <Radio.Group defaultValue={this.state.viewTypeResponse} style={rightButtonStyle} onChange={this.changeRawViewResponse} key={new Date().getTime()}>
          <Radio.Button value="raw">Raw</Radio.Button>
          <Radio.Button value="json">Json</Radio.Button>
        </Radio.Group>
      </div>


    let rawViewDomRequest=<div style={{background: 'rgba(236, 236, 236, 0)', padding: '0px 0px 0px 10px',}}>
      <div className="url-cus">{entry.request.method} <a>{entry.request.url}</a> {entry.request.httpVersion}</div>
      <div>{entry.request.headers.map((header, i) => (<div key={i}><span style={{fontWeight: "700"}}>{header.name}:</span><span>{header.value}</span></div>))}</div>
      <div style={contentStyle}>{entry.request.postData.text}</div>
      <div style={slstyle}>
        <div>queryString:{entry.request.queryString.map((item, i) => (
          <div key={i}><span style={{fontWeight: "700"}}>{item.name}:</span><span>{item.value}</span>
          </div>))}</div>
        <div>cookies:{entry.request.cookies?entry.request.cookies.map((item,i)=><div key={i}>{item.name}:{item.value}</div>):null}</div>
        <div>headersSize:{entry.request.headersSize}</div>
        <div>bodySize:{entry.request.bodySize}</div>
        <div>时间:{entry.startedDateTime}</div>
        <div>耗时:{entry.time}</div>
      </div>
    </div>

    let rawViewDomResponse=<div>
      <div style={{background: 'rgba(236, 236, 236, 0)', padding: '0px 0px 0px 10px'}}>
        <div>{entry.response.httpVersion} {entry.response.status} {entry.response.statusText}</div>
        <div>{entry.response.headers.map((header, i) => <div key={i}><span style={{fontWeight: "700"}}>{header.name}:</span><span>{header.value}</span></div>)}</div>
        <div style={sbstyle}>
          <div>content-size:
            <span>{entry.response.content.size}</span>
          </div>
          <div>content-type:
            <span>{entry.response.content.mimeType}</span>
            <span> (compression:{entry.response.content.compression})</span>
          </div>
          <div>cookies:{entry.response.cookies}</div>
          <div>redirectURL:{entry.response.redirectURL}</div>
          <div>headersSize:{entry.response.headersSize}</div>
          <div>bodySize:{entry.response.bodySize}</div>
          <div>_transferSize:{entry.response._transferSize}</div>
        </div>
        <div style={{display: "inline-flex", width: "100%"}}>{content_text}</div>
      </div>
      </div>



    return (
      <Animate showProp="data-changing" transitionName="fade">
        <div data-changing={changing}  className={"ex-right-panel"}>
          {requestTitle}
          {this.state.viewTypeRequest=="json"?rawViewDomRequestJson:rawViewDomRequest}
          <div style={{border:"3px solid #ccc"}}/>
          {responseTitle}
          {this.state.viewTypeResponse=="json"?rawViewDomResponseJson:rawViewDomResponse}
        </div>
      </Animate>
    )
  }
}

ExchangePanel.propTypes = {
  cardList: PropTypes.array
}
//   {/*<Card title={card.projectName} bordered={false}>{card.projectDesc}</Card>*/}
//
// {
//   this.state.expand_content ? <Input type="textarea" autosize={true} value={content_text}/> :
//     <div style={contentStyle}>
//     </div>
// }
// <div onClick={this.toggleExpandContent} style={{cursor: "pointer", color: "#91b1ec"}}>
//   <Icon type="arrows-alt"/>
// </div>
