import React, {PropTypes} from 'react'
import {connect} from 'dva'
import {Link} from 'dva/router'
import {Row, Col, Icon, Card, Modal} from 'antd'
import NumberCard from '../../components/dashboard/numberCard'
import Quote from '../../components/dashboard/quote'
import Sales from '../../components/dashboard/sales'
import Weather from '../../components/dashboard/weather'
import RecentSales from '../../components/dashboard/recentSales'
import Comments from '../../components/dashboard/comments'
import Completed from '../../components/dashboard/completed'
import Browser from '../../components/dashboard/browser'
import Cpu from '../../components/dashboard/cpu'
import User from '../../components/dashboard/user'
import  './DetailPage.less'
import {color} from '../../utils'
import {Table, Button} from "antd"
import  EditableTable from "../../components/EditableTable/EditableTable"
import EditableTableForItem from "../../components/EditableTable/EditableTableForItem";
import DragSortPanel from "../../components/DragSortPanel/DragSortPanel";
import PropsTable from "../../components/PropTable/PropsTable";
import CodeBox from "../../components/CodeBox/CodeBox";
import PropsTableEach from "../../components/PropTable/PropsTableEach";
import PropsTableOperation from "../../components/PropTable/PropsTableOperation";
import AddChildArea from "./AddChildArea";
import {isEmptyObject} from "../../utils/ArrayUtil";
class DetailPage extends React.Component {
  state = {
    collapsed: false,
  };

  intiData = (props) => {
    if(props.pimTypes && props.currentItem){
      if(props.currentType==null || props.currentType.typeId!=props.currentItem.typeId )
        for(let a of props.pimTypes){
          if(a.typeId==props.currentItem.typeId){
              props.dispatch && props.dispatch({type: "typePage/pureUpdate",  currentType:a} )
          }
        }
    }
    this.cloneTypeProps(props);
    this.setState({childData:this.buildData(props,props.currentItem&&props.currentItem.itemId)})
  }


  componentDidMount = () => {
    let props=this.props
    if(props.currentItem==null){
      if (props.params.shortName) {
        props.dispatch && props.dispatch({type: "itemPage/getItemByShortName", shortName: props.params.shortName})
      }
    }
    if (props.currentItem) {
      // props.dispatch && props.dispatch({type: "itemPage/getAllOperationByItem", itemId: props.currentItem.itemId})
      props.dispatch && props.dispatch({type: "itemPage/getAllOperationByType",  typeId: props.currentItem.typeId} )
    }
    this.intiData(this.props);
  }

  componentWillReceiveProps(props) {
    if (props.params.shortName && props.params.shortName != this.props.params.shortName) {
      props.dispatch && props.dispatch({type: "itemPage/getItemByShortName", shortName: props.params.shortName})
    }
    if (this.props.currentItem == null || (  props.currentItem && props.currentItem.itemId != this.props.currentItem.itemId)) {
      if (props.currentItem != null){
        props.dispatch && props.dispatch({type: "itemPage/getAllOperationByType", typeId: props.currentItem.typeId} )

      }
      //  props.dispatch && props.dispatch({type: "itemPage/getAllOperationByItem", itemId: props.currentItem.itemId})
    }

    if( props.tmpModalShouldClose){
      this.setState({visible:false,childData:this.buildData(props,props.currentItem&&props.currentItem.itemId)})
    }
    if(props.currentItem!=this.props.currentItem){
      this.intiData(props)
    }
  }

  saveState = (propsString) => {
    let newitem = {...this.props.currentItem}
    newitem.itemProps = propsString
    this.props.dispatch && this.props.dispatch({type: "itemPage/pureUpdate", currentItem: newitem})
  }
  addOneProps = () => {
    this.props.dispatch && this.props.dispatch({type: "itemPage/addOnePropOnCurrentItem"})
  }
  addOp = () => {
    this.props.dispatch && this.props.dispatch({type: "itemPage/addOneOperationOnCurrentOperation", itemId: this.props.currentItem.itemId})
  }
  saveByIndex = (index) => {
    let itemback = this.props.currentItemBackUp
    let itemnow = this.props.currentItem
    let kvListback = JSON.parse(itemback.itemProps)
    let kvListnow = JSON.parse(itemnow.itemProps)
    let newList = [...kvListback]
    let itemtmp = {...itemnow}
    if(kvListnow.length>0) delete kvListnow[index].__editable__
    this.deleteEmpty(kvListnow)
    this.deleteEmpty(newList)
    this.mergeListByKey(newList,kvListnow[index])  //  newList.push(kvListnow[index])
    this.deleteDupForce(newList)
    itemtmp.itemProps = JSON.stringify(newList)
    this.props.dispatch && this.props.dispatch({type: "itemPage/commitSaveItem", item: itemtmp})
  }
  mergeListByKey=(arr,item)=>{
    for(let i=0;i<arr.length;i++){
      let tmp=arr[i]
      if(tmp.key==item.key){
        arr.splice(i,1,item)
      }
    }
  }
  deleteEmpty = (kvList) => {
    for (let i = 0; i < kvList.length; i++) {
      if (kvList[i].key == "") {
        kvList.splice(i, 1)
        i--
      }
    }
  }
  deleteByArrKey = (arr, keyName) => {
    for (let i = 0; i < arr.length; i++) {
      let tmp = arr[i]
      if (tmp.key == keyName) {
        arr.splice(i, 1)
        i--
      }
    }
  }
  deleteByIndex = (keyName) => {
    let itemback = this.props.currentItemBackUp
    let kvListback = JSON.parse(itemback.itemProps)
    this.deleteByArrKey(kvListback, keyName)
    let itemtmp = {...itemback}
    itemtmp.itemProps = JSON.stringify(kvListback)
    this.props.dispatch && this.props.dispatch({type: "itemPage/commitSaveItem", item: itemtmp})
  }
  disableByIndex = (keyName, sta) => {
    let itemback = this.props.currentItemBackUp
    let kvListback = JSON.parse(itemback.itemProps)
    let itemtmp = {...itemback}
    for (let s of kvListback) {
      if (s.key == keyName) {
        s.disabled = sta
      }
    }
    itemtmp.itemProps = JSON.stringify(kvListback)
    this.props.dispatch && this.props.dispatch({type: "itemPage/commitSaveItem", item: itemtmp})
  }

  saveOp = (op) => {
    this.props.dispatch && this.props.dispatch({type: "itemPage/commitSaveOperation", op})
  }
  showAddA = () => {

  }
  commitDeleteOp = (id) => {
    this.props.dispatch && this.props.dispatch({type: "itemPage/commitDeleteOperation", id})
  }
  toggleShowModal = () => {
    this.props.dispatch && this.props.dispatch({type: "itemPage/pureUpdate", tmpModalShouldClose:false})
    this.setState({visible: !this.state.visible})
  }
  handleOkAddChild = () => {

  }
  commitAddChild=(item)=>{
    this.props.dispatch && this.props.dispatch({type: "itemPage/commitSaveItemTmp", item})
  }
  hasPermissionAddOperation=()=>{
    /*暂不允许进行编辑*/
    return false
  }
  /**
   * 如果类型级别添加了属性,自动添加属性并保存
   */
  cloneTypeProps=(props)=>{
    /*不匹配情况下提前退出*/
    if( props.currentItem &&  props.currentType &&   props.currentItem.typeId!=props.currentType.typeId){
      return
    }
    if(props.currentItem!=null && props.currentType){
      let itemProps= props.currentItem.itemProps
      let typeProps= props.currentType.typeProps
      let itemPList=JSON.parse(itemProps||"[]")
      let typePList=JSON.parse(typeProps||"[]")
      if(this.isNeedMerge(itemPList,typePList)){
        let newItemPList=this.mergeByKey(itemPList,typePList)
        let newitem={...this.props.currentItem}
        newitem.itemProps=JSON.stringify(newItemPList)
         props.dispatch &&  props.dispatch({type: "itemPage/commitSaveItem", item:newitem})
         props.dispatch &&  props.dispatch({type: "itemPage/pureUpdate", currentItem:newitem,currentItemBackUp:newitem})
      }
    }
  }
  isNeedMerge=(itemProps,typeProps)=>{
    let out=false
    if(itemProps!=null && typeProps!=null){
      if(typeProps.length>itemProps.length){
        return true
      }
      for(let at of typeProps){
        if(!this.keyIsIn(itemProps,at.key)){
          return true
        }
      }
      return false
    }
  }
  mergeByKey(arr,pend){
    let out=[...arr]
    for(let ai of pend){
      if(!this.keyIsIn(arr,ai.key)){
          out.push(ai)
      }
    }
    this.deleteDup(out);
    return out
  }
  deleteDup=(arr)=>{
    if(arr==null ||arr.length==0 ) return
    for(let i=0;i<arr.length;i++){
      for(let j=i;j<arr.length;j++){
        if(j==i) continue
        let a=arr[i]
        let b=arr[j]
        if(a.key==b.key && a.value!=b.value){
          arr.splice(j,1)
          j--
        }
      }
    }
  }
  deleteDupForce=(arr)=>{
    if(arr==null ||arr.length==0 ) return
    for(let i=0;i<arr.length;i++){
      for(let j=i;j<arr.length;j++){
        if(j==i) continue
        let a=arr[i]
        let b=arr[j]
        if(a.key==b.key){
          arr.splice(j,1)
          j--
        }
      }
    }
  }


  keyIsIn=(arr,key)=>{
    for(let at of arr){
      if(at.key==key)
        return true
    }
    return false
  }
  toEditMode=()=>{
    this.setState({isCanEditKey:!this.state.isCanEditKey})
  }
  hasPermissionAdd=()=> {
    if (this.props.permissionList === null) return false
    for (let s of this.props.permissionList) {
      if (s.name === "UPDATE" || s.name === "ADD") {
        return true
      }
    }
    return false
  }
  buildData=(props,id)=>{
    let childData=[]
    if(id==null) {
      this.setState({childData})
    }else{
      for(let as of props.allItem){
        if(as.itemMainParentId==id){
          childData.push({...as})
        }
      }
    }
    return childData
  }



  render() {
    let item = this.props.currentItem
    if (item == null) item = {}




    const childColumns = [ {
      title: 'id',dataIndex: 'itemId',key: 'itemId',},
      {title: '名称',dataIndex: 'itemName',key: 'itemName',},
      {title: '唯一名称',dataIndex: 'itemShortName',key: 'itemShortName',},
    ];

    return (
      <div>

        <Row>
          <Col span={22}>
            <div className="big-name">{item.itemName}</div>
          </Col>
          <Col span={2}>{!this.hasPermissionAdd()?null: <Button onClick={this.toggleShowModal}>添加子类</Button> } </Col>
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            {/*buttons={<Button onClick={this.toEditMode} className="myBtn" size="small">编辑</Button>}*/}
            <CodeBox title="属性字段"  visible={true}>
              <PropsTableEach
                dataBackUp={this.props.currentItemBackUp && this.props.currentItemBackUp.itemProps}
                editable={true}
                data={item.itemProps}
                onSave={this.saveState}
                saveOne={this.saveByIndex}
                deleteOne={this.deleteByIndex}
                disableOne={this.disableByIndex}
                isCanEditKey={false}
                isCanDelete={false}
                hasPermission={this.hasPermissionAdd()}
              />
            </CodeBox>
            <CodeBox title="子类列表"  visible={true}>
              <Table className="mini-tab" dataSource={this.state.childData} tmpModalShouldClose={this.props.tmpModalShouldClose} columns={childColumns}  size="small" pagination={false}/>
            </CodeBox>

          </Col>
          <Col span={8}>
            <CodeBox title="操作" buttons={!this.hasPermissionAddOperation()?null:<Button onClick={this.addOp} className="myBtn" size="small">添加</Button>} visible={true}>

              <PropsTableOperation data={this.props.currOperationList}
                                   saveOne={this.saveOp}
                                   deleteOne={this.commitDeleteOp}
              />

            </CodeBox>
          </Col>
        </Row>
        <AddChildArea visible={this.state.visible }
                      parentId={this.props.currentItemBackUp&&this.props.currentItemBackUp.itemId}
                      parentTypeId={this.props.currentItemBackUp&&this.props.currentItemBackUp.typeId}
                      toggleShowModal={this.toggleShowModal}
                      onSave={this.commitAddChild}
                      pimTypes={this.props.pimTypes}/>

      </div>
    )
  }
}
export default connect(({itemPage, typePage, permission,}) => ({
  permissionList: permission.permissionList,
  typePage, itemPage,
  ...itemPage,
  currentType:typePage.currentType,
  allItem: itemPage.allItem,
  currentItem: itemPage.currentItem,
  currentItemBackUp: itemPage.currentItemBackUp,
  updateId: itemPage.updateId,
  pimTypes:typePage.pimTypes,
  currOperationList: itemPage.currOperationList,
  tmpModalLoading:itemPage.tmpModalLoading,
  tmpModalShouldClose:itemPage.tmpModalShouldClose,
}))(DetailPage)
