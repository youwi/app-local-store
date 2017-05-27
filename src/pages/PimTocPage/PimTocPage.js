import React, {PropTypes} from 'react'
import {connect} from 'dva'
import {Link} from 'dva/router'
import {Row, Col, Icon, Card} from 'antd'
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
import styles from '../PimTypePage/PimTypePage.less'
import {color} from '../../utils'
import {Table, Popconfirm, Button} from "antd"
import  EditableTable from "../../components/EditableTable/EditableTable"
import EditableTableForType from "../../components/EditableTable/EditableTableForType";
import QueryPreview from "../../components/QueryPreview/QueryPreview";
import request from "../../utils/request";
import * as config from "../../../config";
import "./PimTocPage.less"
class TocPage extends React.Component {
  state = {};

  componentDidMount = () => {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: nextProps.data})
  }

  handleChange = () => {

  }

  doSaveLink = (src, target) => {
    this.props.dispatch({type: "tocPage/link", src, target})
  }
  changeSearch = (v) => {
    this.setState({search: v})
  }
  initDefaultViewData=()=>{
    let out = {}
    let listOut = []
    if (this.props.data != null && this.props.data.length > 0) {
      for (let s in this.props.data[0]) {
        out[s] = s
        listOut.push({key: s, value: s})
      }
      for (let s of this.props.data) {
        if (s.itemProps || s.typeProps) {
          let arr = JSON.parse(s.itemProps || s.typeProps)
          for (let i of arr) {
            listOut.push({key: i.key, value: i.key})
          }
        }
      }
    }
    this.props.dispatch({type: "tocPage/pureUpdate", kvList:listOut})
    return listOut
  }
  saveView = (name, obj) => {
    this.props.dispatch({type: "tocPage/saveView", name, cover: obj})
  }
  getPreivew = (url) => {
    request(url, {
      method: 'get'
    }).done((data) => {
      this.setState({previewData: data})
    })
  }

  render() {
    return (
      <div>
        <QueryPreview allToc={this.props.tocList}
                      allView={this.props.viewList}
                      previewData={this.state.previewData}
                      getPreivew={this.getPreivew}
                      viewData={this.props.kvList}
                      saveView={this.saveView}
                      param={this.state.search}
                      url=""
                      target="shortName"
                      saveLink={this.doSaveLink}/>

      </div>
    )
  }
}
export default connect(({tocPage, permission,}) => ({permissionList: permission.permissionList,...tocPage}))(TocPage)
