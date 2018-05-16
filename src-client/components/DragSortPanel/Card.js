
import React, { PropTypes ,Component} from 'react';
import "./panel.less"
import { DragSource,DropTarget } from 'react-dnd';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {Icon} from "antd"
import { findDOMNode } from 'react-dom';

const dragType="DragType"

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const cardTarget = {
  hover:(props, monitor, component)=>{
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;


    const clientOffset = monitor.getClientOffset();

    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    props.moveCard(dragIndex, hoverIndex);


    monitor.getItem().index = hoverIndex;
  },
};


 class Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    connectDragPreview:PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
    moveCard: PropTypes.func.isRequired,
  };

  render() {
    const { text, isDragging, connectDragSource, connectDropTarget,connectDragPreview } = this.props;
    const opacity = isDragging ? 0 : 1;


    return connectDragPreview(connectDropTarget(
      <div className="moveTarget" style={{ opacity }}>
        {connectDragSource(
         <div className="moveHandle"  > <Icon type="bars" /></div>
        )}
        <div>{text}</div>
      </div>
    ));

  }
}
let Card4T=DropTarget(dragType,cardTarget,connect => ({
  connectDropTarget: connect.dropTarget()})
)(Card)
let Card4S=DragSource(dragType,cardSource,(connect,monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()})
)(Card4T)

export default Card4S
//
