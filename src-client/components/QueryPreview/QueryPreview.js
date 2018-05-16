import React, {PropTypes} from 'react';
import {Icon, Popover, Select, Button} from "antd"
import "./querypreview.less"
import {objectUrlEncode} from "../../utils/ArrayUtil";
import "brace";
import "brace/mode/javascript"
import "brace/mode/json"

import AceEditor from "react-ace"
import PropsTable from "../PropTable/PropsTable";
import PropsTableObj from "../PropTable/PropsTableObj";
import CodeBox from "../CodeBox/CodeBox";
import LinkArea from "./LinkArea";
import ViewArea from "./ViewArea";

export default class QueryPreview extends React.Component {

  state = {
    visible: false,
    visibleViewList:true,
    visibleLinkList:true,
  }
  componentDidMount = () => {
    let {viewData, target, url} = this.props
    this.setState({target, viewData, url})
  }

  componentWillReceiveProps(next) {
    let {viewData, target, url} = next
    this.setState({target, viewData, url})
  }

  handleClick = (event) => {
    this.props.onClick(event);
  };
  onSave = () => {
    if (this.props.saveLink) {
      this.props.saveLink(this.buildLink(), this.state.target || this.props.target)
    }
  }
  visibleLinkChange = (visible) => {
    this.setState({visibleLink: visible});
  }
  visibleViewChange = (visible) => {
    this.setState({viewVisible: visible});
  }
  buildLink = () => {
    return this.state.url + objectUrlEncode(this.props.param)
  }
  toggleShowPreview = () => {
    if (this.props.getPreivew) {
      this.props.getPreivew(this.buildLink())
    }
    this.setState({showPreviw: !this.state.showPreviw})
  }
  hide = () => {
    this.setState({
      visible: false,
    });
  }
  buildLinkLisk = () => {
    return this.props.allToc.map((item, i) => <Select.Option key={i} value={item.tocParam}>{item.tocParam}</Select.Option>
    )

  }
  selectLink = (v) => {
    this.setState({url: v})
  }
  saveView = (list) => {
    if (list.constructor == String) {
      list = JSON.parse(list)
    }
    if (this.props.saveView) {
      let out = {}
      for (let item of list) {
        out[item.key] = item.value
      }
      this.state.viewOutData = out
    }
  }
  commitSaveView = () => {
    this.props.saveView(this.state.viewName, this.state.viewOutData)
  }
  changeUrl = (e) => {
    if (e.target) {
      this.setState({url: e.target.value})
    } else {

    }
  }
  toggleShowOther = () => {
    this.setState({visibleOther: !this.state.visibleOther})
  }
  toggleShowViewList=()=>{
    this.setState({visibleViewList: !this.state.visibleViewList})
  }
  toggleShowLinkList=()=>{
    this.setState({visibleLinkList: !this.state.visibleLinkList})
  }

  render() {
    let aceEditor=<AceEditor mode={"json"} theme="textmate" name="code" width="100%" maxLines={20}
                             minLines={2} setOptions={{showPrintMargin: false,}} ref="ace"
                             value={JSON.stringify(this.props.previewData || {}, null, 4)} editorProps={{$blockScrolling: Infinity}}
                             onChange={this.saveAceChange} readOnly={true}
                             onLoad={(editor) => {
                               editor.focus();
                               editor.getSession().setUseWrapMode(true);
                             }}/>
    let formAddLink = <span className="form-add-link">
      <div>把当前URL和参数生成短链接</div>
      <input value={this.state.target} onChange={(e) => this.setState({target: e.target.value})}/>
      <button onClick={this.onSave}>确认</button>
    </span>
    let formAddView = (<span className="form-add-view">
        <span className="preview-btn" onClick={this.commitSaveView}>保存</span>
      <input value={this.state.viewName} onChange={(e) => this.setState({viewName: e.target.value})}/>
      <PropsTable editable={true} data={this.state.viewData} onSave={this.saveView}/>
    </span>)

    let tocListDiv = this.props.allToc.map((item, i) => (
      <div key={i} className="t">
        <span className="t-left">{item.tocShortName}</span><span className="t-right">{item.tocParam}</span>
      </div>)
    )
    let viewListDiv = this.props.allView.map((item, i) => (
      <div key={i} className="t">
        <span className="t-left">{item.viewName}</span><span className="t-right"><PropsTableObj editable={true} data={item.viewCover}/></span>
      </div>)
    )

    let addToc= <Popover content={formAddLink} title={null} trigger="click" visible={this.state.visibleView} onVisibleChange={(v)=>this.setState({visibleView:v})}>
      <Button className="myBtn" size="small">添加短链接</Button>
    </Popover>
    let addView=  <Popover content={formAddView} title={null} trigger="click" visible={this.state.visibleLink} onVisibleChange={(v)=>this.setState({visibleLink:v})}>
      <Button className="myBtn" size="small">添加视图</Button>
    </Popover>

    let others= <div>
      <hr className="page"/>
      {aceEditor}
      {/*<CodeBox title="视图列表" buttons={addView} >*/}
        {/*{viewListDiv}*/}
      {/*</CodeBox>*/}
      {/*<CodeBox title="短链接列表" buttons={addToc}>*/}
        {/*{tocListDiv}*/}
      {/*</CodeBox>*/}
    </div>
    let previewDiv= <div className="preview-url-div">
          <span className="preview-input-span">
            <Select notFoundContent={"自定义地址"} style={{width: '100%'}} tags={true} onSearch={this.changeUrl} showSearch searchPlaceholder="标签模式" onChange={this.selectLink}>
             {this.buildLinkLisk()}
           </Select>
            {/*<input onChange={this.changeUrl} className="preview-input" value={this.buildLink()}/>*/}
          </span>
      <span className="right-btn">
            <span className="preview-btn" onClick={this.toggleShowPreview}>预览</span>
            <span className="preview-btn" onClick={this.toggleShowOther}><Icon type={this.state.visibleOther ? "down-circle" : "left-circle"}/></span>
          </span>
    </div>

    return (
      <div className="preview-main-div">
        {/*previewDiv*/}
        {this.state.visibleOther ?others:null}
        <LinkArea  />
        <ViewArea  />
      </div>)
  }

}
//  allToc={this.props.allToc} saveLink={this.props.saveLink}
