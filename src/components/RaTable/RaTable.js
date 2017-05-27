import React, {PropTypes} from 'react'



import {Table, Popconfirm, Select, Tooltip, Icon, Button,Modal} from "antd"


export default  class RaTable extends React.Component {

  state={
    colSpanList:[],
    rowSpanMark:{}
  }
  buildTableData=()=>{
    let headers=this.props.types
    let data=this.props.data

  }
  renderContent = (value, row, index,typeId) => {
    const obj = {
      children: value,
      props: {
      },
    };
    if(row.typeId==typeId){
      obj.children=row.itemName
      obj.props.rowSpan=this.state.rowSpanMark[row.typeId]
    }else{
      // obj.props.rowSpan=1
      // obj.props.colSpan=0
    }

    return obj;
  };

  /**
   * 合并数据
   * @param data
   */
  sortMergeData=(props)=>{
    let data=props.data
    let cols=props.types
    let colSpanList=[]
    let countChildList=[]
    for(let a of data){
      for(let b of data)
        if(b.itemMainParentId==a.itemId){
          countChildList.push({})
        }
    }
    for(let col of cols){
      let count=0
      for(let k of data){
        if(col.id==k.itemId)
          count++
      }
      colSpanList.push(count)
    }
    this.state.colSpanList=colSpanList
  }

  sortByType=()=>{

  }
  initData=(props)=>{
    if( props.data && props.type){
      this.state.data=[...props.data]
      this.state.types=[...props.type]
    }

    this.setState({data:props.data,types:props.types})
    this.buildRowSpanMark(props)
    this.sortMergeData(props)
    let allHeaders=props.types.map((item,i)=>{
      return {
        title:item.typeName,
        rowSpan:this.state.rowSpanMark[item.typeId],
        render:(v,r,i)=>this.renderContent(v,r,i,item.typeId)
      }
    })
    this.setState({columns:allHeaders})
  }
  buildRowSpanMark=(props)=>{
    let rowmark={}
    for(let type of props.types){
      rowmark[type.typeId]=0
      for(let item of props.data){
        if(type.typeId===item.typeId){
          rowmark[type.typeId]=rowmark[type.typeId]+1
        }
      }
    }
    this.setState({rowSpanMark:rowmark})
  }
  componentDidMount=()=>{
    this.initData(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.initData(nextProps)
  }

  render(){
    return <div>
      <Table columns={this.state.columns}
                       dataSource={this.props.data}
                       bordered
                       pagination={false}
                       size={"small"}/>
    </div>
  }

}
