
import React, { PropTypes } from 'react';
import "./inputs.less"
export default class HeaderInput extends React.Component {
  state={
    value:this.props.value
  }

  handleClick = (event) => {
    if( this.props.onClick)
      this.props.onClick(event);
  };
  handleChange=(event)=>{
    this.setState({value:event.target.value})
    if(this.props.onChange)
      this.props.onChange(event.target.value)
  }
  componentDidMount=()=>{

  }
  componentWillReceiveProps(nextProps) {
    this.setState({value:nextProps.value})

  }

  render() {
    return <input className={this.props.className||"header-input"} value={this.state.value} placeholder={this.props.placeholder} onClick={this.handleClick} onChange={this.handleChange}/>;
  }

}

