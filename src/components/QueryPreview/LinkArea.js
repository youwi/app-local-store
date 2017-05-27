import React, {PropTypes} from 'react';
import {Icon, Popover, Select, Button,Tooltip} from "antd"
import "./querypreview.less"
import {objectUrlEncode} from "../../utils/ArrayUtil";


import AceEditor from "react-ace"
import PropsTable from "../PropTable/PropsTable";
import PropsTableObj from "../PropTable/PropsTableObj";
import CodeBox from "../CodeBox/CodeBox";
import {connect} from 'dva'
 class LinkArea extends React.Component {

  componentDidMount = () => {
    this.props.dispatch&&this.props.dispatch({type: 'tocPage/getAllToc'})
  }
   shouldComponentUpdate=()=>{
    return true
   }


  addTmpToc=()=>{
    let tocList=[...this.props.tocList]
    if(tocList!=null && tocList.length>=0){
      tocList.splice(0,0,{tocShortName:"",tocParam:"",__editable__:true,tocId:-1*Math.floor(Math.random()*10000)})
      this.props.dispatch({type:"tocPage/pureUpdate",tocList:tocList})
    }
  }
  delToc=(i)=>{
    this.props.dispatch({type:"tocPage/delLink",id:this.props.tocList[i].tocId})
  }
  commitToc=(i)=>{
    this.props.dispatch({type:"tocPage/link",src:this.props.tocList[i].tocParam,target:this.props.tocList[i].tocShortName,tmpId:this.props.tocList[i].tocId})
  }

  cancelToc=(i)=>{
    let tocList=[...this.props.tocList]
    if(tocList[i].__editable__){
      delete tocList[i].__editable__
      if(tocList[i].tocId<0)
        tocList.splice(i,1)
    }
    this.props.dispatch({type:"tocPage/pureUpdate",tocList:tocList})
  }
  toggleEdit=(i)=>{

    let tocList=[...this.props.tocList]
    if(tocList[i].__editable__){
      tocList[i].__editable__=false
    }else{
      tocList[i].__editable__=true
    }
    this.props.dispatch({type:"tocPage/pureUpdate",tocList:tocList})
  }
  changeTargetValue=(i,target,value)=>{
    let tocList=[...this.props.tocList]
    tocList[i][target]=value
    this.props.dispatch({type:"tocPage/pureUpdate",tocList:tocList})
  }
  canSave=(item)=>{
    if(this.isEmpty(item))
      return false
    return  this.isUniqe(item)
  }
  isUniqe=(item)=>{
    for(let k of this.props.tocList){
      if((k.tocShortName==item.tocShortName )&& (k.tocId!=item.tocId)){
          return false
      }
    }
    return true
  }
  isEmpty=(item)=>{
    if(  item.tocShortName==null
      || item.tocShortName==""
      || item.tocParam==null
      || item.tocParam==""){
      return true
    }
    return false
  }
  checkName=(item)=>{
    if(item.tocShortName==null|| item.tocShortName==""){
      return true
    }else{
      return this.isUniqe(item)
    }
  }
  checkPara=(item)=>{
     if(( item.tocParam==null|| item.tocParam=="") &&(item.tocShortName==null|| item.tocShortName=="")){
       return true
     }else if( !(item.tocParam==null|| item.tocParam=="") && (item.tocShortName==null|| item.tocShortName=="")){
       return false
     }else if(!(item.tocParam==null|| item.tocParam=="") && !(item.tocShortName==null|| item.tocShortName=="")){
       return true
     }
  }


  render() {
    let nameTip= <Tooltip placement="top" title={"名称不唯一"}>
      <Icon type="exclamation-circle" />
    </Tooltip>
    let saveTip= <Tooltip placement="left" title={"输入不正确"}>
      <Icon type="exclamation-circle" />
    </Tooltip>
    let urlTop=<Tooltip placement="top" title={"不能为空"}>
      <Icon type="exclamation-circle" />
    </Tooltip>

    let tocListDiv =  this.props.tocList&&this.props.tocList.map((item, i) => {
      if(item.__editable__){
        return <div className="t" key={i}>
            <span className="t-left"><input value={item.tocShortName} onChange={(e)=>this.changeTargetValue(i,"tocShortName",e.target.value)} />
              {this.checkName(item)?null:nameTip}
            </span>
            <span className="t-right"><input value={item.tocParam} onChange={(e)=>this.changeTargetValue(i,"tocParam",e.target.value)}/>
              {this.checkPara(item)?null:urlTop}
            </span>
            {this.canSave(item)?<span className="t-edit-first  preview-btn" onClick={()=>this.commitToc(i) }><Icon type="check-circle" /></span>:
              <span className="t-edit-first  preview-btn">{saveTip}</span>}
            <span className="t-edit preview-btn" onClick={()=>this.cancelToc(i) }><Icon type="close-circle" /></span>
          </div>
      }else{
       return  <div key={i} className="t">
         <span className="t-left">{item.tocShortName}</span>
         <span className="t-right">{item.tocParam}</span>
         <span className="t-edit-first preview-btn" onClick={()=>this.toggleEdit(i)}><Icon type="edit" /></span>
         <span className="t-edit preview-btn" onClick={()=>this.delToc(i)}><Icon type="delete" /></span>
       </div>
      }
    })

    return (
      <div className="preview-main-div" >
        <CodeBox title="短链接列表" buttons={  <Button onClick={this.addTmpToc} className="myBtn" size="small">添加短链接</Button>}>
          {tocListDiv}
        </CodeBox>
      </div>)
  }

}
export default connect(({tocPage, permission,}) => ({permissionList: permission.permissionList,tocList:tocPage.tocList,updateId:tocPage.updateId}))(LinkArea)
