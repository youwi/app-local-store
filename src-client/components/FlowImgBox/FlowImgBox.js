import React from 'react'
import Dropzone from "react-dropzone"
import {Button, InputNumber, Input, Icon,Row,Col,Card} from "antd"
import "./FlowImgBox.less"
import VersionNumber from "../VersionNumber/VersionNumber";
import Lightbox from "react-image-lightbox"

export  default  class FlowImgBox extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  getLastName=(str)=>{
    if(str!=null){
     let arr= str.split("/")
      return arr[arr.length-1]
    }
  }
  isHtmlPage=(str)=>{
    if(str!=null && str.indexOf(".html")>-1 || str.indexOf(".htm")>-1){
      return true
    }else{
      return false
    }
  }
  choseLink=(link)=>{

  }

  render() {

    let arr = this.props.links.map((link, i) =>
        <Col offset="1">
          <Card style={{ width: 240 }} bodyStyle={{ padding: 0 }}>
          <div className="custom-image">
          {
            this.isHtmlPage(link)?<Icon type="file" />:<img onClick={()=>this.setState({isOpen:true,currLink:link})} alt={this.getLastName(link)} width="100%" src={link} />
          }
          </div>
          <div className="custom-card">
            <h3><a href={link} target="blank">{this.getLastName(link)}</a></h3>
          </div>
        </Card>
        </Col>

    )


    return  ( <div className="FlowImgBox">
      <Row type="flex" justify="start">
      {arr}
    </Row>
      {
        this.state.isOpen &&
        <Lightbox
          mainSrc={this.state.currLink}
          onCloseRequest={() => this.setState({ isOpen: false })}
        />
      }
    </div>)

  }
}


