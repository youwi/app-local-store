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
class DetailTypePage extends React.Component {
  state = {
    collapsed: false,
  };

  intiData = (props) => {

    if (props.params.shortName) {
      props.dispatch && props.dispatch({type: "typePage/getTypeByShortName", shortName: props.params.shortName})
    }
    if (props.currentType) {
     // props.dispatch && props.dispatch({type: "itemPage/getAllOperationByItem", typeId: props.currentType.typeId})
      props.dispatch && props.dispatch({type: "typePage/getAllOperationByType",  typeId: props.currentType.typeId} )
    }

  }

  componentDidMount = () => {
    this.intiData(this.props);
  }

  componentWillReceiveProps(props) {
    if (props.params.shortName && props.params.shortName != this.props.params.shortName) {
      props.dispatch && props.dispatch({type: "typePage/getTypeByShortName", shortName: props.params.shortName})
    }
    if (this.props.currentType == null || (  props.currentType && props.currentType.typeId != this.props.currentType.typeId)) {
      if (props.currentType != null)
      //  props.dispatch && props.dispatch({type: "typePage/getAllOperationByItem", typeId: props.currentType.typeId})
        props.dispatch && props.dispatch({type: "typePage/getAllOperationByType", typeId: props.currentType.typeId} )
    }
    if( props.tmpModalShouldClose){
      this.setState({visible:false})
    }
  }

  saveState = (propsString) => {
    let newitem = {...this.props.currentType}
    newitem.typeProps = propsString
    this.props.dispatch && this.props.dispatch({type: "typePage/pureUpdate", currentType: newitem})
  }
  addOneProps = () => {
    this.props.dispatch && this.props.dispatch({type: "typePage/addOnePropOnCurrentType"})
  }
  deleteDupForce=(arr)=>{
    if(arr==null ||arr.length==0 ) return
    for(let i=0;i<arr.length;i++){
      for(let j=i;j<arr.length;j++){
        if(j==i) continue
        let a=arr[i]
        let b=arr[j]
        if(a.key==b.key || a.id==b.id){
          arr.splice(j,1)
          j--
        }
      }
    }
  }
  saveByIndex = (index) => {
    let itemback = this.props.currentTypeBackUp
    let itemnow = this.props.currentType
    let kvListback = JSON.parse(itemback.typeProps)
    let kvListnow = JSON.parse(itemnow.typeProps)
    let newList = [...kvListback]
    let itemtmp = {...itemnow}
    if(kvListnow.length>0) delete kvListnow[index].__editable__
    this.deleteEmpty(kvListnow)
    this.deleteEmpty(newList)
    this.mergeListById(newList,kvListnow[index]) // newList.push(kvListnow[index])
    this.deleteDupForce(newList)
    itemtmp.typeProps = JSON.stringify(newList)
    this.props.dispatch && this.props.dispatch({type: "typePage/commitSaveType", item: itemtmp})
  }
  mergeListById=(arr,item)=>{
    let found=false
    for(let i=0;i<arr.length;i++){
      let tmp=arr[i]
      if(tmp.id==item.id){
        found=true
        arr.splice(i,1,item)
      }
    }
    if(!found){
      arr.push(item)
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
    let itemback = this.props.currentTypeBackUp
    let kvListback = JSON.parse(itemback.typeProps)
    this.deleteByArrKey(kvListback, keyName)
    let itemtmp = {...itemback}
    itemtmp.typeProps = JSON.stringify(kvListback)
    this.props.dispatch && this.props.dispatch({type: "typePage/commitSaveType", item: itemtmp})
  }
  disableByIndex = (keyName, sta) => {
    let itemback = this.props.currentTypeBackUp
    let kvListback = JSON.parse(itemback.typeProps)
    let itemtmp = {...itemback}
    for (let s of kvListback) {
      if (s.key == keyName) {
        s.disabled = sta
      }
    }
    itemtmp.typeProps = JSON.stringify(kvListback)
    this.props.dispatch && this.props.dispatch({type: "typePage/commitSaveType", item: itemtmp})
  }


  toggleShowModal = () => {
    this.props.dispatch && this.props.dispatch({type: "typePage/pureUpdate", tmpModalShouldClose:false})
    this.setState({visible: !this.state.visible})
  }


  render() {
    let item = this.props.currentType
    if (item == null) item = {}


    return (
      <div>

        <Row>
          <Col span={22}>
            <div className="big-name">{item.typeName}</div>
          </Col>
          {/*<Col span={2}> <Button onClick={this.toggleShowModal}>添加子类</Button> </Col>*/}
        </Row>

        <Row gutter={16}>
          <Col span={16}>
            <CodeBox title="模板属性字段" buttons={<Button onClick={this.addOneProps} className="myBtn" size="small">添加属性</Button>} visible={true}>
              <PropsTableEach
                dataBackUp={this.props.currentTypeBackUp && this.props.currentTypeBackUp.typeProps}
                editable={true}
                data={item.typeProps}
                onSave={this.saveState}
                saveOne={this.saveByIndex}
                deleteOne={this.deleteByIndex}
                disableOne={this.disableByIndex}
                isNeedValue={false}
              />
            </CodeBox>
          </Col>
        </Row>

      </div>
    )
  }
}
export default connect(({itemPage, typePage, permission,}) => ({
  permissionList: permission.permissionList,
  ...typePage, itemPage,
  allItem: itemPage.allItem,
  currentTypeBackUp: typePage.currentTypeBackUp,
  updateId: typePage.updateId,
  pimTypes:typePage.pimTypes,
  currOperationList: itemPage.currOperationList,
  tmpModalLoading:itemPage.tmpModalLoading,
  tmpModalShouldClose:itemPage.tmpModalShouldClose,
}))(DetailTypePage)
