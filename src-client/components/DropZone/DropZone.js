import React from 'react'
import Dropzone from "react-dropzone"
import {Button, InputNumber, Input, Icon, message} from "antd"
import "./DropZone.less"
import VersionNumber from "../VersionNumber/VersionNumber";
import ImgPreview from "../ImgFilePreview/ImgPreview";
import moment from "moment"

export default class DropZone extends React.Component {
  constructor() {
    super()
    this.state = {
      accepted: [],
      rejected: [],
      version: "1.0.0",
      disableTag: false,
    }
  }

  onDrop = (acceptedFiles, rejected) => {
    if (this.isZipFile(this.state.accepted)) {
      this.state.accepted = []
    }
    let accepted = [...acceptedFiles, ...this.state.accepted]
    let disableTag = false
    for (let i = 0; i < accepted.length; i++) {
      for (let j = i + 1; j < accepted.length; j++) {
        if (accepted[i].name == accepted[j].name) {
          accepted.splice(j, 1)
          j--
        }
      }
      if (this.endWith(accepted[i].name, ".zip")) {
        let fileName = accepted[i].name
        let arr = fileName.split(".zip")
        accepted.length = 1
        disableTag = true
        this.setState({tag: arr[0],})
      }
      if (this.endWith(accepted[i].name, ".apk")) {
        this.setState({tag: "android" + moment().format("YYYY-MM-DD HH:mm:ss")})
      }
      if (this.endWith(accepted[i].name, ".ipa")) {
        this.setState({tag: "IOS" + moment().format("YYYY-MM-DD HH:mm:ss")})
      }
      if (this.endWith(accepted[i].name, ".png") || this.endWith(accepted[i].name, ".jpeg") || this.endWith(accepted[i].name, ".jpg")) {
        this.setState({tag: moment().format("YYYY-MM-DD HH:mm:ss")})
      }
    }

    // 2018-05-21T17:50:54+08:00


    this.setState({accepted, rejected, disableTag})
  }

  componentWillReceiveProps(props) {
    if (props.state === 3) {
      message.info("Upload Success")
      this.setState({accepted: []})
    } else if (props.state === -1) {
      message.error("Upload Failed")
    }
  }

  isZipFile = (arr) => {
    if (arr == null) return false
    for (let file of arr) {
      if (this.endWith(file.name, ".zip")) {
        return true
      } else {
        return false
      }
    }
  }
  endWith = (str, pix) => {
    var reg = new RegExp(pix.toLowerCase() + "$");
    return reg.test(str.toLowerCase());
  }

  commit = () => {
    if (this.props.upload) {
      this.props.upload(this.state)
    }
  }
  handleVersion = (version) => {
    this.setState({version})
  }
  changeTag = (event) => {
    if (event.target) {
      this.setState({tag: event.target.value})
    }
  }
  clearByName = (event, name) => {
    if (event.stopPropagation) {
      event.stopPropagation()
    }
    for (let i = 0; i < this.state.accepted.length; i++) {
      let file = this.state.accepted[i]
      if (name == file.name) {
        this.state.accepted.splice(i, 1)
        break
      }
    }
    this.setState({accepted: this.state.accepted})
  }
  deleteById = (i) => {
    this.state.accepted.splice(i, 1)
    this.setState({accepted: this.state.accepted})
  }

  render() {

    return (
      <section>
        <div className="dropZone">
          <Dropzone accept="image/jpeg,image/png,application/zip,application/*" onDrop={this.onDrop}>
            <div className="dropZone-msg">
              <div>拖入文件(多文件请一起拖入)</div>
              <div>支持jpeg,png,zip,html</div>
              <div>图片会自动索引,压缩包会自动解压</div>
              {
                this.state.accepted.map(f =>
                  <div className="file-div" key={f.name}>{f.name} - {f.size} bytes
                    <Button shape="circle" onClick={(e) => this.clearByName(e, f.name)} icon="close" size={"small"}/>
                  </div>
                )
              }
            </div>
          </Dropzone>
        </div>
        <div className="dropZone-btn">
          <VersionNumber version={this.state.version} onChange={this.handleVersion}/>
        </div>
        <div className="dropZone-btn">
          <div>
            {!this.state.disableTag && <Input onChange={this.changeTag} addonBefore={"Tag/Type:"} defaultValue={this.state.tag} value={this.state.tag}/>}
          </div>
        </div>
        {!this.state.disableTag && <ImgPreview files={this.state.accepted} delete={this.deleteById}/>}

        <aside className="dropZone-btn">

          <Button.Group>
            <Button type="primary" disabled={!this.state.accepted.length > 0} onClick={this.commit}>提交</Button>
          </Button.Group>
        </aside>
      </section>
    );
  }
}


