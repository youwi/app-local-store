import React from 'react';
import PropTypes from 'prop-types';



import "./CodeBox.less"

import {Table, Popconfirm, Select, Tooltip, Icon, Button,Modal} from "antd"

export default  class CodeBox extends React.Component {

  state={
     visible:this.props.visible
  }

  componentDidMount=()=>{
    if(this.props.visible!=null)
      this.setState({ visible:this.props.visible})
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.visible!=null)
        this.setState({ visible:nextProps.visible})
  }
  toggleShow = () => {
    this.setState({ visible: !this.state. visible})
  }

  render(){
    return <div className="preview-main-section">
      <section className="code-box-meta markdown">
        <div className="code-box-title">
          <span className="code-box-label">{this.props.title}</span>
          <span className="preview-btn" onClick={this.toggleShow}><Icon type={this.state. visible ? "down-circle" : "left-circle"}/></span>
        </div>
        {
          !this.state. visible?null:
            <div className="code-box-title-right">
              {this.props.buttons}
            </div>
        }

        <div><div>{this.state. visible?this.props.children:null}</div></div>
      </section>
    </div>
  }
}
