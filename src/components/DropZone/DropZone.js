
import React from 'react'
import Dropzone from "react-dropzone"
import {Button,InputNumber,Input} from "antd"
import "./DropZone.less"
import VersionNumber from "../VersionNumber/VersionNumber";

export  default  class DropZone extends React.Component {
  constructor() {
    super()
    this.state = {
      accepted: [],
      rejected: [],
      version:"1.0.0"
    }
  }
  onDrop= (acceptedFiles,rejected)=> {
    this.setState({ accepted:acceptedFiles, rejected })

  }
  commit=()=>{
    if(this.props.upload){
      this.props.upload(this.state)
    }
  }
  handleVersion=(version)=>{
    this.setState({version})
  }
  changeTag=(event)=>{
    if(event.target){
      this.setState({tag:event.target.value})
    }
  }

  render() {
    return (
      <section>
        <div className="dropZone">
          <Dropzone   accept="image/jpeg, image/png" onDrop={this.onDrop} >
            <div className="dropZone-msg">
              <div>拖入文件(多文件请一起拖入)</div>
              <div>支持jpeg,png,zip,html</div>
              <div>图片会自动索引,压缩包会自动解压</div>

              {
                this.state.accepted.map(f => <div key={f.name}>{f.name} - {f.size} bytes</div>)
              }
            </div>
          </Dropzone>
        </div>
        <div className="dropZone-btn">
          <VersionNumber version={this.state.version} onChange={this.handleVersion}/>
        </div>
        <div className="dropZone-btn">
          <div>
            <Input onChange={this.changeTag} addonBefore={"Tag/Type:"} defaultValue={this.state.tag}/>
          </div>
        </div>
        <aside className="dropZone-btn">

          <Button.Group>
            <Button type="primary" disabled={!this.state.accepted.length>0} onClick={this.commit}>提交</Button>
          </Button.Group>
        </aside>
      </section>
    );
  }
}


