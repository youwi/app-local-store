import React, {PropTypes} from 'react'



import {Table, Popconfirm, Select, Tooltip, Icon, Button,Modal} from "antd"


export default  class RaTableMe extends React.Component {

  state={
    colSpanList:[],
    rowSpanMark:{},
    allRow:[]
  }
  initData=()=>{
    /*有效关系行数*/
    let markCount=0
    for(let sk of this.props.data){
      if(sk.typeId!=null && sk.itemMainParentId!=null){
        markCount++
      }
    }

    /*生成子级有效行数*/
    let markChildCount={}
    for(let ita of this.props.data){
      markChildCount[ita.itemId]=0
      for(let itb of this.props.data){
        if(ita.itemId=itb.itemMainParentId){
          markChildCount[ita.itemId]++
        }
      }
    }

  }
  getEndNodeList=()=>{
    let out=[]
  //  return out
    for(let item of this.props.data){
      console.log("eeeee")
      let found=false
       for(let itemb of this.props.data){
         console.log("dddd")
         if(item.itemMainParentId==itemb.itemId){
           found=true
           break;
         }
      }
      if(!found){
         out.push(item)
      }
    }
    return out
  }
  buildRows=()=>{
    let out=[]
    let endList=this.getEndNodeList()
    let _count_=0
    for(let end of endList){
      console.log("ccccc")
      let row=[end]
      let isRoot=true
      while(isRoot){
        _count_++
        let parent=this.getById(end.itemMainParentId)
        console.log("kkkk")

        if(parent!=null){
          row.splice(0,0,parent)
        }else{
          isRoot=false
        }

      }
      out.push(row)
    }
    return out
  }
  buildObList=(data)=>{
    let out=[]
    for(let item of data){
      if(item.itemMainParentId!=null &&item.typeId!=null){
          let preitem=this.getById(item.itemMainParentId )
      }
    }
  }
  getById=(id)=>{
    if(id==null) return null
    for(let item of this.props.data){
      if(item.itemMainParentId==id){
        console.log("bbbb")
        return item
      }

    }
    return null
  }
  componentDidMount=()=>{
    this.state.allRow=this.buildRows(this.props)
  }
  componentWillReceiveProps(nextProps) {

  }



  render(){
    let allRow=this.buildRows()
    console.log("aa111a")
    return <div>
      {allRow.map((row,i)=>row.map((item,j)=><span>{item.itemName}</span>))}
    </div>
  }

}
