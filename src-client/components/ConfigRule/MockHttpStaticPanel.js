import React, {PropTypes} from 'react'
import {Menu, Icon, Button, Row, Col, Card, Input, Tabs, Switch, Tooltip,Radio} from 'antd'
import {Link} from 'dva/router'
import styles from './MockHttpStaticPanel.less'
import _ from "lodash";
import {Table} from 'antd';
import JsonViewM2 from "../JsonViewM2/JsonViewM2"
import  Animate  from 'rc-animate';
import HeaderInput from "../Inputs/HeaderInput"
import PlusButton from "../Buttons/PlusButton"
import MinusButton from "../Buttons/MinusButton"
import "./MockHttpStaticPanel.less"
import status from "statuses"

export default class MockHttpStaticPanel extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.headers = []
    this.state.code = 200
    this.state.content = ""
    this.state.ruleType = 1
    this.state.isRaw=false
    this.state.bodyView="json"
  }

  componentWillReceiveProps = (next) => {
    if (next.rule.id != this.props.rule.id)
      this.parseRuleContent(next)
  }
  parseRuleToRaw = (rule) => {
    let out="HTTP/1.1 "
    out=out+rule.code+" "
    out=out+status[rule.code]+"\n"
    if(rule.headers.length>0)
    for(let header of rule.headers){
      if(header.name.trim()!="")
        out=out+header.name+":"+header.value+"\n"
    }
    out=out+"\n"
    out=out+rule.content
    return out
  }
  parseRawToRule=(text)=>{
    if(text==null) return;
    let lines=text.split("\n");
    let codeLine="";
    let headerLines=[]
    let bodyLines=""
    for(let line of lines){
      if(line.indexOf("HTTP/1.1 ")==0){
        codeLine=line
      }else{
        headerLines.push(line);
      }
      if(line.trim()=="")
        break;
    }
    for(let i=headerLines.length;i<lines.length;i++){
      bodyLines+=lines[i]
    }
    let rule={code:200,headers:[],content:bodyLines}
    rule.code=codeLine.match(/\d\d\d/)[0]

    for(let line of headerLines){
      rule.headers.push({name:line.split(":")[0],value:line.split(":")[1]})
    }
    return rule
  }


  parseRuleContent = (props) => {

    if (props.rule.ruleContent) {
      let obj
      if (props.rule.ruleContent.trim() == "")
        obj = {}
      else {
        try {
          obj = JSON.parse(props.rule.ruleContent);
        } catch (e) {
          obj = {}          //console.error(e)
        }
      }
      let emtpyHeader = {name: "", value: ""}
      this.setState({headers: obj.headers || [emtpyHeader], content: obj.content || "", code: obj.code || 200})
    }
  }
  componentDidMount = () => {
    this.parseRuleContent(this.props)
  }

  commitRule = () => {

  }
  changeRuleType = () => {

  }
  changeRawContent=(e)=>{
    if(e&& e.target){
      let raw=e.target.value
      let rule=this.parseRawToRule(raw)
      this.setState({...rule})
    }
  }
  addHeader = (index) => {
    this.state.headers.splice(index + 1, 0, {name: "", value: ""})
    this.setState({headers: this.state.headers})
  }
  delHeader = (index) => {
    this.state.headers.splice(index, 1)
    this.setState({headers: this.state.headers})
  }
  changeContent = (event) => {
    if (event && event.target)
      this.setState({content: event.target.value})
    if(event!=null && event.constructor==String){
      this.setState({content: event})
    }
  }
  changeHeaderName = (index, value) => {
    this.state.headers[index].name = value
    this.setState({headers: this.state.headers})
  }
  changeHeaderValue = (index, value) => {
    this.state.headers[index].value = value
    this.setState({headers: this.state.headers})
  }
  toggleRaw=()=>{
    this.setState({isRaw:!this.state.isRaw})
  }
  changeCode=(e)=>{
    if(e&&e.target){
      this.setState({code:e.target.value})
    }
  }
  onSave=()=>{
    //let newheaders=[]
    // for(let header of this.state.headers){
    //   if(header==null || header.name==null || header.value==null || header.name=="" || header.value==""){
    //
    //   }else{
    //     newheaders.push(header);
    //   }
    // }
    let newheaders=this.state.headers.filter((header)=>!(  header==null || header.name==null || header.value==null || header.name=="" || header.value==""))
    this.state.headers=newheaders
    if(this.props.onCommitContent)
      this.props.onCommitContent( JSON.stringify(this.state))
  }
  addJsonHeader=()=>{
    this.state.headers.push({name:"Content-Type",value:"application/json;charset=utf-8"})
    this.setState({headers: this.state.headers})
  }
  addJsHeader=()=>{
    this.state.headers.push({name:"Content-Type",value:"application/javascript;charset=utf-8"})
    this.setState({headers: this.state.headers})
  }
  addXmlHeader=()=>{
    this.state.headers.push({name:"Content-Type",value:"application/xml;charset=utf-8"})
    this.setState({headers: this.state.headers})
  }
  addHtmlHeader=()=>{
    this.state.headers.push({name:"Content-Type",value:"text/html;charset=utf-8"})
    this.setState({headers: this.state.headers})
  }
  changeRawView=(e)=>{
    this.setState({bodyView:e.target.value})
  }
  handleEnterKey=(e)=>{
    if(e.keyCode == 13 && e.ctrlKey){
      // 这里实现换行
    }else if(e.keyCode == 13){
      // 避免回车键换行
      this.insertText(e.target,"\nexample:1")
      this.changeRawContent(e)
      e.preventDefault();
      // 下面写你的发送消息的代码
    }
  }
  insertText=(obj,str) =>{
    if (document.selection) {
      var sel = document.selection.createRange();
      sel.text = str;
    } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
      var startPos = obj.selectionStart,
        endPos = obj.selectionEnd,
        cursorPos = startPos,
        tmpStr = obj.value;
      obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
      cursorPos += str.length;
      obj.selectionStart = obj.selectionEnd = cursorPos;
    } else {
      obj.value += str;
    }
  }
  getSddmRspTPL=()=>{
    if(this.props.sddmAPI!=null&& this.props.sddmAPI.id!=null) {
      let tpl = this.props.sddmAPI.responseTemplate
      this.setState({content:tpl})
    }
  }
  pullSDDM=()=>{
    if(this.props.actions !=null){
      if(this.props.actions.constructor==Function ){
        this.props.actions()
      }
      if(this.props.actions.constructor==Array){
        for(let item of this.props.actions){
          if(item!=null && item.constructor==Function){
            if(item.name.indexOf("SDDM")>-1)
              item()
          }
        }
      }
    }
  }
  contentLengthHeaderWarn=(item)=>{
    if(item!=null){
      if(item.name.toLowerCase()=="content-length"){
        item.warn="警告"
        return <span className="warn-label">警告</span>
      }
    }
    return null
  }
  render = () => {
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

    let formatDiv=  <div>
      <div className="http-p-title">Response Code</div>
      <div className="http-code-div"> <Input size="small"  value={this.state.code} placeholder="200" onChange={this.changeCode}/></div>

      <div className="http-p-title">Response Headers
        <span className="http-short">
          <Tooltip placement="top" title={"添加json的类型请求头"}>
              <a onClick={this.addJsonHeader}>json</a>
          </Tooltip>
          <a onClick={this.addJsHeader}>js</a>
          {/*<a onClick={this.addXmlHeader}>xml</a>*/}
          <a onClick={this.addHtmlHeader}>html</a>
        </span>
      </div>
      {this.state.headers.map((item, i) => <div className="header-line" key={item + i}>
        <HeaderInput value={item.name} onChange={(v) => this.changeHeaderName(i, v)} placeholder="name"/>
        <HeaderInput value={item.value} onChange={(v) => this.changeHeaderValue(i, v)} placeholder="value"/>
        <PlusButton onClick={() => this.addHeader(i)}/>
        <MinusButton onClick={() => this.delHeader(i)}/>
        {this.contentLengthHeaderWarn(item)}
      </div>)}
      <div className="http-p-title" style={titleStyle}>Response Body
          <span className="http-short">
           <Tooltip placement="top" title={"从SDDM拉取响应示例"}>
             {/*<a onClick={this.getSddmRspTPL}>sddm</a>*/}
          </Tooltip>
          </span>
        <Radio.Group defaultValue={this.state.bodyView} style={rightButtonStyle} onChange={this.changeRawView} key={new Date().getTime()}>
          <Radio.Button value="text">Text</Radio.Button>
          <Radio.Button value="json">Json</Radio.Button>
        </Radio.Group>
      </div>
      {this.state.bodyView=="json"?<JsonViewM2 text={this.state.content} onSave={this.changeContent}/>
        :<Input type="textarea" rows={14} value={this.state.content} onChange={this.changeContent}/>}
    </div>

    let bulkDiv=<div className="bulk-div">
      <Input type="textarea" rows={24} value={this.parseRuleToRaw(this.state)} onChange={this.changeRawContent} onKeyDown={this.handleEnterKey} />
      <span> 注:可以复制,编辑,粘贴和替换,不能使用换行符</span>
     </div>

     return (
      <div>
        <span className="http-fun-buttons">
          <Tooltip placement="top" title={"文本块方式查看"}>
            <Switch checkedChildren={''}  defaultChecked={this.state.isRaw} onChange={this.toggleRaw} unCheckedChildren={''}/>
          </Tooltip>
          <Tooltip placement="top" title={"立即保存"}>
            {/*<Button  size={"small"} onClick={this.changeContent}>Save</Button>*/}
            <Button  shape="circle" icon="save" style={{transform: "scale(1.5,1.5)"}} onClick={this.onSave}/>
          </Tooltip>
        </span>
        {this.state.isRaw?bulkDiv:formatDiv}


      </div>
    )
  }
}
 //transform: scale(0.8, 0.8);
//type="primary"  type={"dashed"}  size={"small"}

