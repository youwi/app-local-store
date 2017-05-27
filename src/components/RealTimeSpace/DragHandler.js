import React, { PropTypes } from 'react'

import { config } from '../../utils'

export default class DragHandler extends React.Component{
  constructor(props){
    super( );

    this.state={};
  }
  componentDidMount=()=>{

  }
  componentWillUnmount=()=>{

  }
  clickInit=(event)=> {
    this.state.oldX=event.clientX;
  }
  clickEnd=()=>{
    let offset=this.state.oldX-this.state.newX;
    this.setState({posStyle:{right:-1.5},oldX:0,newX:0})
    if(!isNaN(offset) && offset!=0)
      this.props.reachData&&this.props.reachData((offset-5)*-1);
  }
  clickMove=(event)=>{
    if(this.state.oldX==0) return;
    this.state.newX=event.clientX;
    let offset=this.state.oldX-this.state.newX;
    if(!isNaN(offset))
      this.setState({posStyle:{right:offset||0}})
  }

  render=()=>{

   return <span className="">
     {this.props.children}
       <span style={this.state.posStyle} onMouseMove={this.clickMove} onMouseDown={this.clickInit} onMouseLeave={this.clickEnd} onMouseUp={this.clickEnd}   className="resize-handler-mid">
         <span className="resize-handler"/>
       </span>
   </span>
  }

}
// onDragStart={this.dragStart} onDragEnd={this.dragEnd} onDrag={this.dragIng}
//  dragStart=(event)=>{
// this.state.oldPageX=event.pageX;
// }
// dragEnd=(event)=>{
//   if(this.state.newPageX==0)
//     this.state.newPageX=event.pageX;
//   this.props.reachData&&this.props.reachData(this.state.newPageX-this.state.oldPageX);
//   console.log(this.state.newPageX-this.state.oldPageX)
// }
// dragIng=(event)=>{
//   this.state.newPageX=event.pageX;
// }
