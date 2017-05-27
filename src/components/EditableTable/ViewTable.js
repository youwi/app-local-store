import React, {PropTypes} from 'react'


import  EditableCell from "./EditableCell"
import {Table, Popconfirm, Select, Tooltip, Icon, Button,Modal} from "antd"
import EditableTable from "./EditableTable";
import PropsTable from "../PropTable/PropsTable";

export default  class ViewTable extends EditableTable {


  renderColumns=(data, index, key, text)=>{
    if(key==="itemProps"){
      let rowId=data[index].itemId
      return this.buildPropsButton(data, index, key, text,rowId)
    }
      return <span>{text}</span>;
  }
  buildPropsButton=(data, index, key, text,rowId)=>{
    return (
      <span size={"small"} className="props-btn" onClick={()=>this.toggleExpandedRowKeys(data,index,text,rowId)}>
        <Icon type="paper-clip" />
      </span>
    )
  }
  getRowKey=()=>{
    return "viewId"
  }
  expandedRowRender=(record)=><PropsTable data={ record.itemProps } editable={false} onSave={(v)=>record.itemProps=v}/>

  toggleExpandedRowKeys=(data,index,text,rowId)=>{

    if(this.state.expandedRowKeys===null) this.state.expandedRowKeys=[]
    if(this.state.expandedRowKeys.indexOf(rowId)>-1 ) {
      this.state.expandedRowKeys.splice(this.state.expandedRowKeys.indexOf(rowId),1)
    }else{
      this.state.expandedRowKeys.push(rowId)
    }
    this.setState({expandedRowKeys:this.state.expandedRowKeys})
  }

  buildAllColumns=(data)=>{
    let cellColumns=this.buildColumns(data)
    return cellColumns
  }

}
