
import React from 'react';

import {Icon} from "antd"
import "./buttons.less"
class MinusBuuton extends React.Component {



  handleClick = (event) => {
    this.props.onClick(event);
  };

  render() {
    return <span className="mini-btn minus-btn" onClick={this.handleClick} ><Icon type="minus-circle" /> </span>;
  }

}

export default MinusBuuton;
