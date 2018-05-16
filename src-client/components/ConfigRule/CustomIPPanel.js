import React, {PropTypes} from 'react'
import {Menu, Icon, Button, Row, Col, Card, Input, Tabs, Switch, Tooltip} from 'antd'

import HeaderInput from "../Inputs/HeaderInput"
import PlusButton from "../Buttons/PlusButton"
import MinusButton from "../Buttons/MinusButton"
import "./CustomIPPanel.less"
import status from "statuses"

export default class CustomIPPanel extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.state.address = ""
    this.state.port =8080
  }

  componentWillReceiveProps = (next) => {
    if (next.rule.id != this.props.rule.id){
      this.initData(next)
    }
  }
  initData=({address,port})=>{
    this.state.address=address
    this.state.port=port
  }

  componentDidMount = () => {
      this.initData(this.props.rule)
  }

  onSave=()=>{
    if(this.props.onCommitContent)
      this.props.onCommitContent( JSON.stringify(this.state))
  }
  buildUrl=()=>{
    this.state.address
  }
  changeHttp=(e)=>{
    this.setState({protocol:e.target.value})
  }
  changePort=(e)=>{
    this.setState({port:e.target.value})

  }
  changeHost=(e)=>{
    this.setState({host:e.target.value})
  }

  render = () => {


    return (
      <div style={{padding:"10px"}}>
        <span className="http-fun-buttons http-fun-buttons-single">
          <Tooltip placement="top" title={"立即保存"}>
            {/*<Button  size={"small"} onClick={this.changeContent}>Save</Button>*/}
            <Button  shape="circle" icon="save" style={{transform: "scale(1.5,1.5)"}} onClick={this.onSave}/>
          </Tooltip>
        </span>
        <div className="http-code-div">
          <Input size="small"  value={this.state.code} placeholder="http" onChange={this.changeHttp}/>
          <Input size="small"  value={this.state.code} placeholder="127.0.0.1" onChange={this.changeHost}/>
          <Input size="small"  value={this.state.code} placeholder="8080" onChange={this.changePort}/>
        </div>
        <div>{"http://"}{this.state.address}{this.state.port}{this.props.rule.apiUrl}</div>
      </div>
    )
  }
}
//transform: scale(0.8, 0.8);
//type="primary"  type={"dashed"}  size={"small"}

