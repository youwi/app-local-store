import React, {PropTypes} from 'react';
import {Icon, Popover, Select, Button, Tooltip} from "antd"
import "./querypreview.less"
import {objectUrlEncode} from "../../utils/ArrayUtil";


import AceEditor from "react-ace"
import PropsTable from "../PropTable/PropsTable";
import PropsTableObj from "../PropTable/PropsTableObj";
import CodeBox from "../CodeBox/CodeBox";
import {connect} from 'dva'
class ViewArea extends React.Component {
  componentDidMount = () => {
    this.props.dispatch && this.props.dispatch({type: 'tocPage/getAllView'})
  }


  giveAView=()=>{
    return {
      __editable__:true,
      "viewId":-1 * Math.floor(Math.random() * 10000),
      "viewType":0,
      "viewName":null,
      "viewCover":"{}",
      "viewSource":null,
    }
  }
  addTmpView = () => {
    let viewList = [...this.props.viewList]
    if (viewList != null && viewList.length >= 0) {
      viewList.splice(0, 0, this.giveAView())
      this.props.dispatch({type: "tocPage/pureUpdate", viewList})
    }
  }
  delView = (i) => {
    this.props.dispatch({type: "tocPage/delView", id:this.props.viewList[i].viewId})
  }
  saveView=(i,value)=>{

    let viewList = [...this.props.viewList]
    viewList[i]["viewCover"] =  value
    this.props.dispatch({type: "tocPage/pureUpdate", viewList})
  }
  kvToMap=(kvString)=>{
    let kv=JSON.parse(kvString);
    let ob={}
    for(let ta of kv){
      ob[ta.key]=ta.value
    }
    return ob
  }
  mapToKv=(mapString)=>{
    let ob=JSON.parse(mapString)
    let kv=[]
    for(let a in ob){
      kv.push({key:a,value:ob[a]})
    }
    return kv
  }
  commitView = (i) => {
    this.props.dispatch({type: "tocPage/saveView", name: this.props.viewList[i].viewName, cover: this.props.viewList[i].viewCover, tmpId: this.props.viewList[i].viewId})
  }

  cancelView = (i) => {
    let viewList = [...this.props.viewList]
    if (viewList[i].__editable__) {
      delete viewList[i].__editable__
      if (viewList[i].viewId < 0)
        viewList.splice(i, 1)
    }
    this.props.dispatch({type: "tocPage/pureUpdate", viewList})
  }
  toggleEdit = (i) => {
    let viewList = [...this.props.viewList]
    if (viewList[i].__editable__) {
      viewList[i].__editable__ = false
    } else {
      viewList[i].__editable__ = true
    }
    this.props.dispatch({type: "tocPage/pureUpdate", viewList})
  }
  changeTargetValue = (i, target, value) => {
    let viewList = [...this.props.viewList]
    viewList[i][target] = value
    this.props.dispatch({type: "tocPage/pureUpdate", viewList})
  }
  canSave = (item) => {
    if(this.isNameOk(item) && !this.isNullString(item.viewName)){
      return true
    }
  }
  isUniqe = (item) => {
    for(let tmp of this.props.viewList){
      if((tmp.viewName==item.viewName) && (tmp.viewId!=item.viewId)){
        return false
      }
    }
    return true
  }
  isEmpty = (item) => {

  }
  isNameOk = (item) => {
    return this.isUniqe(item)
  }
  isParaOk = (item) => {

  }
  parseJSON=(str)=>{
    if(str==null) return {}
    if(str.constructor==Object){
      return str
    }
    try {
      let tmp= JSON.parse(str)
      if(tmp!=null && tmp.constructor==String){
        tmp=JSON.parse(tmp)
      }
      return tmp
    }catch(e) {
      return {}
    }
  }
  isNullString=(str)=>{
      if(str==null || str=="" || str.trim()==""){
        return true
      }else return false
  }


  render() {
    let nameTip = <Tooltip placement="top" title={"名称不唯一"}>
      <Icon type="exclamation-circle"/>
    </Tooltip>
    let saveTip = <Tooltip placement="left" title={"输入不正确"}>
      <Icon type="exclamation-circle"/>
    </Tooltip>
    let urlTop = <Tooltip placement="top" title={"不能为空"}>
      <Icon type="exclamation-circle"/>
    </Tooltip>

    let viewListDiv = this.props.viewList && this.props.viewList.map((item, i) => {
        if (item.__editable__) {
          return <div className="t" key={i}>
            <span className="t-left"><input value={item.viewName} onChange={(e) => this.changeTargetValue(i, "viewName", e.target.value)}/>
              {this.isNameOk(item) ? null : nameTip}
            </span>
            <span className="t-right"> <PropsTableObj editable={true} data={this.parseJSON(item.viewCover)} onSave={(v)=>this.saveView(i,v)}/>
              {/*{this.isParaOk(item) ? null : urlTop}*/}
            </span>
            {this.canSave(item) ? <span className="t-edit-first  preview-btn" onClick={() => this.commitView(i) }><Icon type="check-circle"/></span> :
              <span className="t-edit-first  preview-btn">{saveTip}</span>}
            <span className="t-edit preview-btn" onClick={() => this.cancelView(i) }><Icon type="close-circle"/></span>
          </div>
        } else {
          return <div key={i} className="t">
            <span className="t-left">{item.viewName}</span>
            <span className="t-right"> <PropsTableObj editable={false} data={this.parseJSON(  item.viewCover)} onSave={()=>{}}/></span>
            <span className="t-edit-first preview-btn" onClick={() => this.toggleEdit(i)}><Icon type="edit"/></span>
            <span className="t-edit preview-btn" onClick={() => this.delView(i)}><Icon type="delete"/></span>
          </div>
        }
      })
    return (
      <div className="preview-main-div">
        <CodeBox title="视图列表" buttons={  <Button onClick={this.addTmpView} className="myBtn" size="small">添加视图</Button>}>
          {viewListDiv}
        </CodeBox>
      </div>)
  }

}
export default connect(({tocPage, permission,}) => ({permissionList: permission.permissionList, viewList: tocPage.viewList, updateId: tocPage.updateId}))(ViewArea)
