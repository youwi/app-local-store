
import React, { PropTypes } from 'react';
import {Icon} from "antd"
import "./buttons.less"

class AddButton extends React.Component {



  handleClick = (event) => {
    this.props.onClick(event);
  };

  render() {
    return <span className="mini-btn plus-btn" onClick={this.handleClick} ><Icon type="plus-circle" /> </span>;
  }

}

export default AddButton;
