import { Table, Input, Popconfirm } from 'antd';
import React, {PropTypes} from 'react'
export default  class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: this.props.editable || false,
  }

  handleChange(e) {
    const value = e.target.value;
    this.setState({ value });
    if(this.props.onChange){
      this.props.onChange(value)
    }
  }
  render() {
    const { value, editable } = this.props;
    return (
      <div  className={editable?"editable":""}>
        {
          editable ?
            <div>
              <Input
                placeholder="空白"
                value={value}
                onChange={e => this.handleChange(e)}
              />
            </div>
            :
            <div className="editable-row-text">
              {value.toString() || ' '}
            </div>
        }
      </div>
    );
  }
}


