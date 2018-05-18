import React from 'react';
import PropTypes from 'prop-types';


import {Table,Popconfirm,Icon,Switch} from "antd"
import  EditableCell from "./EditableCell"
import "./table.less"
import HeaderInput from "../Inputs/HeaderInput";
import {objectUrlEncode} from "../../utils/ArrayUtil";

const isDataEqual=(data1,data2)=>{
  if(data1==null && data2==null){
    return  true
  }
  if(  JSON.stringify(data1)== JSON.stringify(data2)){
    return true
  }else{
    return false
  }

}
const cloneArrayObject=(arr)=>{
  if(arr!=null){
    return arr.map((item)=>{return {...item}})
  }else{
    return out
  }
}
export default  class EditableTable extends React.Component {
  state = {
    data:this.props.data||[{}],
    dataBackUp:[...this.props.data]||[{}],
    expandedRowKeys:[],
    columns:[{}],
    search:{}
  };

  componentDidMount=()=>{
    this.setState({columns:this.buildAllColumns(this.state.data),data:  this.props.data , dataBackUp:cloneArrayObject(this.props.data)})
  }
  componentWillReceiveProps(nextProps) {

  //  if(isDataEqual(nextProps.data,this.props.data)) return
    this.setState({data:nextProps.data,dataBackUp:cloneArrayObject(nextProps.data),search:{}})
    this.setState({columns:this.buildAllColumns(nextProps.data)})
  }

  handleChange=(key, index, value)=>{
     let newdata=[...this.state.data]
    newdata[index][key]=value
    this.setState({data:newdata})
  }
  renderColumns=(data, index, key, text)=>{
    const { _editable, status } = data[index];
    if (typeof _editable === 'undefined') {
      return <span>{text}</span>;
    }
    return (<EditableCell  key={index}
                           editable={_editable}
                           value={text}
                           onChange={value => this.handleChange(key, index, value)}
                           status={status}
    />);
  }

  AllFilterMethod=()=>{
    let dataCache=[]
    for (let record of this.props.data) {
      let allKey=Object.keys(this.state.search)
        let bState=true
        for(let keyName of allKey){
            if(!this.filterKey(this.state.search[keyName],record,keyName)){
              bState=false
              break;
            }
        }
        if(bState){
          dataCache.push(record)
        }
    }
   /* if(dataCache.length==0) dataCache.push({}) */
    this.setState({data: dataCache})
  }
  filterKeyOther=(filterString, record, filed)=>{
    return false
  }
  filterKey = (filterString, record, filed) => {
    /*不允许搜索空白*/
    if(record[filed]===null){
      if(  filterString==" "){
        return true
      }
      return false;
    }
    filterString = filterString.toLowerCase();
    let fullString = ""
    if(record[filed].constructor ===String ){
      fullString= record[filed].toString().toLowerCase();
    }
    if((record[filed].constructor!==String) && (record[filed].props!=null)){
      fullString=record[filed].props.children
    }
    if(record[filed].constructor ===Boolean ){
      fullString= record[filed]+""
    }
    if(record[filed].constructor ===Number ){
      fullString= record[filed]+""
    }
    /*空白匹配*/
    if((fullString==""||fullString==null) && filterString==" "){
      return true
    }
    fullString=fullString.trim()
    filterString=filterString.trim()
    /*空白匹配*/
    if((fullString==""||fullString==null) && filterString!=""){
      return false
    }
    if (fullString.indexOf(filterString) > -1)
      return true
    else{
      return this.filterKeyOther(filterString, record, filed)
    }
  }

  edit(data,index) {
    if (data[index]) {
      data[index]._editable = true;
    }
    this.setState({ data });
  }
  deleteEmptyData=()=>{
    if(this.state.data){
      for(let i=0;i<this.state.data.length;i++){
        let it=this.state.data[i]
        if(it.id<0 && it._editable==null){
          this.state.data.splice(i,1)
        }
      }
    }
  }
  deleteOrRestore=(data,index,type)=>{

  }
  objCopy=(obj,ori)=>{
    if(obj && ori){
      for(let key in obj){
        obj[key]=ori[key]
      }
    }
  }
  editDone(data,index, type) {
    if(type=="save"&&this.checkRequire(data[index])==false){
        return
    }
    if(type=="cancel"){
        let tmp=data[index]
        if(data.length>0){
          this.deleteOrRestore(data,index,type)
        }
        delete tmp._editable;
        this.setState({data})
    }
   // delete data[index]._editable; 由Model去删除

    this.setState({ data }, () => {
      if(type=="save" && this.props.onSave){
        if(this.checkRequire(data[index])==false){
          return
        }
        this.props.onSave(data[index])
      }
    });
  }
  checkRequire=(obj)=>{
    return true
  }
  doDelete=(data,index)=>{
    this.props.onDelete&&this.props.onDelete(data[index])
  }
  hasDeletePermisssion=()=>{
    return true
  }
  toggleDisable=(item,value)=>{
      this.props.onToggleDisable&& this.props.onToggleDisable(item,value)
  }

  renderButton=(text, record, index) => {
    const { _editable } = this.state.data[index];
    return (
      <div className="editable-row-operations">
        {
          _editable ?
            <span className="btn-box">
                  <a className="a-btn-save" onClick={() => this.editDone(this.state.data,index, 'save')}><Icon type="check-circle"/></a>
                  <a className="a-btn-save" onClick={() => this.editDone(this.state.data,index, 'cancel')}><Icon type="close-circle"/></a>
                </span>
            :
            <span className="a-line">
                  <a onClick={() => this.edit(this.state.data,index)}><Icon type="edit"/></a>
                  {!this.hasDeletePermisssion()?null:<Popconfirm title="确定要删除!?" okText="Yes" cancelText="No" onConfirm={() => this.doDelete(this.state.data,index)}>
                        <a><Icon type="delete"/></a>
                    </Popconfirm>}
              <Switch size={"small"} defaultChecked={record.disabled!=0} onChange={(v)=>this.toggleDisable(record,v)} checkedChildren={'开'} unCheckedChildren={'关'} />

            </span>
        }
      </div>
    );
  }
  renderAsType=(name)=>{
    return (text, record, index)=>{
      return this.renderColumns(this.state.data, index, name, text)
    }
  }
  changeSearchFilter=(key,value)=>{
    let search={...this.state.search}
    search[key+""]=value
    if(value==null || value==""){
      delete  search[key+""]
    }

    this.setState({search},()=>this.AllFilterMethod())
    setTimeout(()=>{
      if(this.props.changeSearch){
        this.props.changeSearch(search)
      }
    },10)

  }
  translate=(text)=>{
    return text
  }
  buildTitle=(text)=>{
    return  (
       <span style={{fontFamily: "anticon"}} key={"header-"+text}>
        <HeaderInput className="th-search-input" value={this.state.search[text+""]||""} placeholder={"\uE670 "+this.translate(text)||""} onChange={(v)=>this.changeSearchFilter(text,v)}/>
       </span>
    )
  }
  buildColumns=(data)=>{
    if(data!=null){
      let arr=[]
      let columnsKeys=[]
      if(data.length>0){
        columnsKeys=Object.keys(data[0])
        this.state.columnsKeys=columnsKeys
      }else{
        columnsKeys=this.state.columnsKeys||[]
      }
      columnsKeys.forEach((item,i)=>{
        if(item!=null && item.indexOf("_")!=0 && item!="key"){
          arr.push({className:item,title: this.buildTitle(item),dataIndex: item,key: i,render:this.renderAsType(item)})
        }
      })
      if(arr.length==0) arr.push({})
      return arr
    }else  {

    }
  }
  buildButtonColumn=()=>{
    return {title: '编辑',dataIndex: 'operation',render: this.renderButton,className:"operation"}
  }
  buildAllColumns=(data)=>{
    let out=[]
    let columns = []
    let buttonColumns=this.buildButtonColumn()
    let cellColumns=this.buildColumns(data)
    if(cellColumns==null){
      return this.state.columns
    }
    if(this.hasPermission()){
        out=columns.concat(cellColumns,buttonColumns)
    }else{
        out=cellColumns
    }
    /* 删除没有在名单中的项目 */
    if(this.props.colHideList!=null){
      for(let i=0;i<out.length;i++){
        let col=out[i]
        let found=false
        for(let show of this.props.colHideList){
            if(show==col.className){
              found=true
            }
        }
        if(!found){
          out.splice(i,1)
          i--
        }
      }
    }
    if(out.length==0) out=this.buildColumns([{loading:"..."}])
    return out
  }
  buildRowClassName=(record, index)=>{
    return record._editable?"row-editable":"table-row"
  }
  expandedRowRender=(record)=><p></p>
  hasPermission=()=>{
    if(this.props.permission==null) return false
    for(let s of this.props.permission){
      if(s.name==="UPDATE" || s.name==="ADD" || s.name==="DELETE"){
        return true
      }
    }
    return false
  }
  getEmptyObj=()=>{
    return [{loading:"..."}]
  }
  getRowKey=()=>{
    return null
  }



  render() {
    let table=null
    let isEmpty=false

    if(this.state.data!=null ){
//&& this.state.data.length>0
      if(this.state.data.length==0) {
        this.state.data=this.getEmptyObj()
        isEmpty=true
      }
      table=<Table expandIconColumnIndex={5}
                   rowKey={this.getRowKey()}
                   expandedRowRender={this.expandedRowRender}
                   expandedRowKeys={this.state.expandedRowKeys}
                   columns={this.buildAllColumns(this.state.data)} dataSource={isEmpty?null:this.state.data} pagination={false} size="small" rowClassName={this.buildRowClassName}/>
    }

    return (
      <div className="EditableTable">
          {table}
      </div>
    )
  }
}
