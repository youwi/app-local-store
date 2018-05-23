import React from 'react'


import Card from 'antd/lib/card';
import Icon from 'antd/lib/icon';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

import 'antd/lib/card/style';
import 'antd/lib/icon/style';
import 'antd/lib/row/style';
import 'antd/lib/col/style';

import "./FlowImgBox.less"
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"

export default class FlowImgBox extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  getLastName = (str) => {
    if (str != null) {
      let arr = str.split("/")
      return arr[arr.length - 1]
    }
  }
  isHtmlPage = (str) => {
    if (str != null && str.indexOf(".html") > -1 || str.indexOf(".htm") > -1) {
      return true
    } else {
      return false
    }
  }
  choseLink = (link) => {

  }

  render() {

    let arr = this.props.links && this.props.links.map((link, i) =>
      <Col offset="1" key={i}>
        <Card style={{width: 240}} bodyStyle={{padding: 0}}>
          <div className="custom-image">
            {
              this.isHtmlPage(link) ? <Icon type="file"/> : <img onClick={() => this.setState({isOpen: true, currLink: link})} alt={this.getLastName(link)} width="100%" src={link}/>
            }
          </div>
          <div className="custom-card">
            <h3><a href={link} target="blank">{this.getLastName(link)}</a></h3>
          </div>
        </Card>
      </Col>
    )


    return (<div className="FlowImgBox">
      <Row type="flex" justify="start">
        {arr}
      </Row>
      {
        this.state.isOpen &&
        <Lightbox
          mainSrc={this.state.currLink}
          onCloseRequest={() => this.setState({isOpen: false})}
        />
      }
    </div>)

  }
}


