
import React from 'react'
import Dropzone from "react-dropzone"
import {Button,InputNumber,Input} from "antd"
import "./VersionNumber.less"

export  default  class VersionNumber extends React.Component {
  constructor() {
    super()

    this.state = {
      versionNumber: [],
    }

  }
  handleVersionString=(str)=>{
    if(str!=null){
      let arr=str.split(".")
      return arr.map(item=>Number(item))
    }
    return []
  }
  componentDidMount=()=>{
    this.setState({versionNumber:this.handleVersionString(this.props.version)})
  }
  componentWillReceiveProps=(props)=>{
    this.setState({versionNumber:this.handleVersionString(props.version)})
  }

  changeMainVersion=(v)=>{
    if(v.constructor ==String){
      this.props.onChange&&this.props.onChange(v)
    }else if(v.target){
      this.props.onChange&&this.props.onChange(v.target.value)
    }
  }
  changeSerVersion=(v)=>{

  }
  changeFixVersion=(v)=>{

  }

  render() {
    return (
      <div className="version-number">
        <Input onChange={this.changeMainVersion} addonBefore={"Version:"} defaultValue={this.props.version}/>
        {/*<Input.Group compact>*/}
          {/*<Input onChange={this.changeMainVersion} style={{ width: '40px' }}/>*/}
          {/*<Input onChange={this.changeSerVersion}  style={{ width: '40px' }}/>*/}
          {/*<Input onChange={this.changeFixVersion}  style={{ width: '40px' }}/>*/}
        {/*</Input.Group>*/}
      </div>
    );
  }
}


