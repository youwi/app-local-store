
import React, { PropTypes ,Component} from 'react';
import "./panel.less"
import { DragSource } from 'react-dnd';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from "./Card"
import { findDOMNode } from 'react-dom';
const style2 = {
  width: 400,
};


/**
 * 排序列表控件,传callback 返回排序后的列表
 */
class DragSortPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
    arr:[]
  }
  componentDidMount=()=>{
    if(this.props.data!=null)
      this.setState({data:this.props.data})
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.data!=null)
      this.setState({data:nextProps.data})
  }
  getListCallBack=()=>{
    if(this.props.callback){
      this.props.callback(this.state.data)
    }
  }

  moveCard=(dragIndex, hoverIndex)=>{
    const { data } = this.state;
    const dragCard = data[dragIndex];

    this.setState(update(this.state, {
      data: {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCard],
        ],
      },
    }));
  }
  delCard=(index)=>{
    let newstate={...this.state}
    newstate.data.splice(index,1)

  }
  addCard=()=>{

  }

  render() {
    const { data } = this.state;

    return (
      <div style={style2}>
        {data.map((card, i) => (
          <Card
            key={card.id}
            index={i}
            id={card.id}
            text={card.text}
            moveCard={this.moveCard}
          />
        ))}
      </div>
    );
  }
}
export default  DragDropContext(HTML5Backend)(DragSortPanel)
