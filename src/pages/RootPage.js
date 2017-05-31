import React, {PropTypes} from 'react'
import {connect} from 'dva'
import Login from './login/login'
import HeaderC from '../components/layout/Header'
import Bread from '../components/layout/bread'
import Footer from '../components/layout/footer'
import SiderC from '../components/layout/sider'
import styles from '../components/layout/layout.less'
import {Spin,message} from 'antd'
import {classnames,menu} from '../utils'
import '../components/layout/common.less'
import { Layout, Menu, Icon } from 'antd';
const { Header, Sider, Content } = Layout;
import  PimTypePage from "./PimTypePage/PimTypePage"
import  PimItemPage from "./PimItemPage/PimItemPage"
import { Link } from 'dva/router'
import RaTable from "../components/RaTable/RaTable";
import MindChart from "../components/MindChart/MindChart";
import {buildSSCData} from "./MapPage/ShareBuildFun";
import DropZone from "../components/DropZone/DropZone";
class RootPage extends React.Component  {
  constructor(props){
    super(props)
    this.state = {
      collapsed: false,
      routePath:["types","items","map","api"],
      defaultSelectedKeys:[],
      defaultSelectedKeysDy:[],
    };
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  componentWillReceiveProps(next) {
    this.state.SSC=buildSSCData(next.allItem)
    this.routeHiFix(next)
  }
  handleClickMenu=(e)=>{
      this.props.dispatch({type:"itemPage/getAllItems"})
      this.props.dispatch({type:"typePage/getAllTypes"})
      this.routeHiFix(this.props)
      this.setState({defaultSelectedKeysDy:[""],newMenuDyKeyIdDy:Math.random()})
  }
  handleClickMenuDy=()=>{
      this.props.dispatch({type:"itemPage/getAllItems"})
      this.props.dispatch({type:"typePage/getAllTypes"})
      this.routeHiFix(this.props)
      this.setState({defaultSelectedKeys:[""],newMenuDyKeyId:Math.random()})
  }
  /* 修正路径和URL导航 */
  routeHiFix=(props)=>{
    //defaultSelectedKeys
    if(props.location.pathname){
      let arr=props.location.pathname.split("/")
      if(arr!=null)
        this.setState({defaultSelectedKeys:[arr[1]]})
    }
  }
  hasPerssionAPI=()=>{
    if (this.props.permissionList === null) return false
    for (let s of this.props.permissionList) {
      if (s.name === "TOC_UPDATE" ) {
        return true
      }
    }
    return false
  }
  hasPerssionManage=()=>{
    if (this.props.permissionList === null) return false
    for (let s of this.props.permissionList) {
      if (s.name === "UPDATE" || s.name=="ADD" ) {
        return true
      }
    }
    return false
  }
  hasPerssionType=()=>{
    if (this.props.permissionList === null) return false
    for (let s of this.props.permissionList) {
      if (s.name === "TYPE_UPDATE" ) {
        return true
      }
    }
    return false
  }
  hasPerssionOpration=()=>{
    if (this.props.permissionList === null) return false
    for (let s of this.props.permissionList) {
      if (s.name === "OPERATION_UPDATE" ) {
        return true
      }
    }
    return false
  }

  render=()=> {
    let {children, location, dispatch, app}=this.props
    const {login, loading, loginButtonLoading, user, siderFold, darkTheme, showBread, msg} = app
    const loginProps = {
      loading,
      loginButtonLoading,
      onOk(data) {
        dispatch({type: 'app/login', payload: data})
      },
      msg
    }

    const headerProps = {
      user,
      siderFold,
      logout() {
        dispatch({type: 'app/logout'})
      },
      switchSider() {
        dispatch({type: 'app/switchSider'})
      }
    }

    const siderProps = {
      siderFold,
      darkTheme,
      location,
      changeTheme(){
        dispatch({type: 'app/changeTheme'})
      }
    }
    //style={{minHeight: calcContentHeight(showBread)}}
    const calcContentHeight = (showBread) => {
      let contentHeight = "";
      if (document.body.clientHeight > 900)
        contentHeight = "calc(100vh - 176px)"
      else
        contentHeight = "calc(100vh - 190px)"
      return contentHeight;
    }
    const calcStyle = () => {

    }
    let tmp=[]
    for(let i=0;i<100;i++){
      tmp.push(  <div key={i}>AAAAAAA</div>)
    }
    let pintMenu= (
      <Menu key={this.state.newMenuDyKeyId} theme="dark" mode="inline" defaultSelectedKeys={this.state.defaultSelectedKeys} onClick={this.handleClickMenu} className="cus-sider-pint">
        {!this.hasPerssionType()?null:<Menu.Item key="types">
          <Icon type="folder" /><Link to="types" style={{display: "inline-flex"}}><span className="nav-text">类别管理</span></Link>
          </Menu.Item>
        }
        <Menu.Item key="items">
          <Icon type="appstore" /><Link to="items" style={{display: "inline-flex"}}><span className="nav-text">子类管理</span></Link>
        </Menu.Item>
        {
          !this.hasPerssionOpration()?null:<Menu.Item key="operation">
            <Icon type="flag"/><Link to="operation" style={{display: "inline-flex"}}> <span className="nav-text">操作管理<span className="beta-msg">beta</span></span></Link>
          </Menu.Item>
        }
        {
          !this.hasPerssionManage()?null:<Menu.Item key="map">
            <Icon type="line-chart" /><Link to="map" style={{display: "inline-flex"}}> <span className="nav-text">聚合图</span></Link>
          </Menu.Item>
        }
        {
          !this.hasPerssionAPI()?null:<Menu.Item key="api">
            <Icon type="link"/><Link to="api" style={{display: "inline-flex"}}> <span className="nav-text">接口视图</span></Link>
          </Menu.Item>
        }

    </Menu>)
    let typeMenu=null;
    let pimTypes=this.props.pimTypes
    if(pimTypes!=null && pimTypes.length>0){
      typeMenu=(
        <Menu key={this.state.newMenuDyKeyIdDy} theme="dark" mode="inline" defaultSelectedKeys={this.state.defaultSelectedKeysDy} onClick={this.handleClickMenuDy} >
          {pimTypes.map((item,i)=>(
            <Menu.Item key={i+""}>
              <Icon type="user"/><Link to={"types/"+item.typeShortName} style={{display: "inline-flex"}}><span className="nav-text">{item.typeName}</span></Link>
            </Menu.Item>) )
          }
        </Menu>)
    }

    if(login){
      return <div className={classnames(styles.layout, styles.fold)}>
        <div className={styles.main}>
          <HeaderC {...headerProps}/>
          <Layout style={{    height: "calc(100vh - 41px)"}} >
            <Sider collapsible collapsed={this.state.collapsed}  onCollapse={this.toggle}   breakpoint="lg" className="cus-sider" >
              <div className="logo"/>
              {typeMenu}
              {pintMenu}
            </Sider>
            <Layout>
              <Header style={{background: '#fff', padding: 0}}>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
              </Header>
              <Content style={{ minHeight: 280,display: "flex",flexDirection: "column",flex: "auto"}}>
                {/*/margin: '24px 16px '/*/}
                <Content style={{ background: '#fff', padding: 24, minHeight: 280}}>
                  {/*{children||  <RaTable types={this.props.pimTypes} data={this.props.allItem}/>}*/}
                  {children|| <DropZone/> }
                  {/*<PimTypePage/>*/}
                  {/*<PimTypePage/>*/}
                  </Content>
                <Footer/>
              </Content>
            </Layout>
          </Layout>
        </div>
      </div>
    }else{
      return (
        <div className={styles.spin}>
          <Spin tip="加载用户信息..." spinning={loading} size="large">{loading ? <div></div> : <Login {...loginProps}/>}</Spin>
        </div>)
    }

  }
}

RootPage.propTypes = {

  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  loginButtonLoading: PropTypes.bool,
  login: PropTypes.bool,
  user: PropTypes.object,
  siderFold:PropTypes.bool,
  darkTheme:PropTypes.bool,
}
//  {showBread ? <Bread location={location} menu={menu}/> : <div style={{height:"16px"}}/>}
export default connect(({app,typePage,itemPage,permission}) => ({app,...typePage,...itemPage,permissionList:permission.permissionList}))(RootPage)
