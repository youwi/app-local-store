import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'dva'
import Login from './login/login'
import HeaderC from '../components/layout/Header'
import Footer from '../components/layout/footer'
import '../components/layout/layout.less'
import {classnames, menu} from '../utils'
import 'antd/lib/spin/style';

import '../components/layout/common.less'

import Spin from "antd/lib/spin"
import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import Layout from 'antd/lib/layout';


const {Header, Content} = Layout;

import {Link} from 'dva/router';

import ProductPage from "./ProductPage/ProductPage";

class RootLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      routePath: ["types", "items", "map", "api"],
      defaultSelectedKeys: [],
      defaultSelectedKeysDy: [],
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  componentWillReceiveProps(next) {

    this.routeHiFix(next)
  }

  handleClickMenu = (e) => {
    this.props.dispatch({type: "itemPage/getAllItems"})
    this.props.dispatch({type: "typePage/getAllTypes"})
    this.routeHiFix(this.props)
    this.setState({defaultSelectedKeysDy: [""], newMenuDyKeyIdDy: Math.random()})
  }
  handleClickMenuDy = () => {
    this.props.dispatch({type: "itemPage/getAllItems"})
    this.props.dispatch({type: "typePage/getAllTypes"})
    this.routeHiFix(this.props)
    this.setState({defaultSelectedKeys: [""], newMenuDyKeyId: Math.random()})
  }
  /* 修正路径和URL导航 */
  routeHiFix = (props) => {
    //defaultSelectedKeys
    if (props.location && props.location.pathname) {
      let arr = props.location.pathname.split("/")
      if (arr != null)
        this.setState({defaultSelectedKeys: [arr[1]]})
    } else {
      let arr = location.pathname.split("/")
      if (arr != null)
        this.setState({defaultSelectedKeys: [arr[1]]})
    }
  }
  hasPerssionAPI = () => {
    if (this.props.permissionList == null) return false
    for (let s of this.props.permissionList) {
      if (s.name === "TOC_UPDATE") {
        return true
      }
    }
    return false
  }
  hasPerssionManage = () => {
    if (this.props.permissionList == null) return false
    for (let s of this.props.permissionList) {
      if (s.name === "UPDATE" || s.name == "ADD") {
        return true
      }
    }
    return false
  }
  hasPerssionType = () => {
    if (this.props.permissionList == null) return false
    for (let s of this.props.permissionList) {
      if (s.name === "TYPE_UPDATE") {
        return true
      }
    }
    return false
  }
  hasPerssionOpration = () => {
    if (this.props.permissionList == null) return false
    for (let s of this.props.permissionList) {
      if (s.name === "OPERATION_UPDATE") {
        return true
      }
    }
    return false
  }

  isRootPath = () => {
    return window.location.hash === "#/?" || window.location.hash === "#/"
  }

  render = () => {
    let {children, location, dispatch, app} = this.props
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
      changeTheme() {
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
    let tmp = []
    for (let i = 0; i < 100; i++) {
      tmp.push(<div key={i}>AAAAAAA</div>)
    }
    let pintMenu = (
      <Menu key={this.state.newMenuDyKeyId} theme="dark" mode="inline" defaultSelectedKeys={this.state.defaultSelectedKeys} onClick={this.handleClickMenu} className="cus-sider-pint">
        {!this.hasPerssionType() ? null : <Menu.Item key="types">
          <Icon type="folder"/><Link to="types" style={{display: "inline-flex"}}><span className="nav-text">--</span></Link>
        </Menu.Item>
        }
        <Menu.Item key="items">
          <Icon type="appstore"/><Link to="items" style={{display: "inline-flex"}}><span className="nav-text">---</span></Link>
        </Menu.Item>
        {
          !this.hasPerssionOpration() ? null : <Menu.Item key="operation">
            <Icon type="flag"/><Link to="operation" style={{display: "inline-flex"}}> <span className="nav-text">操作管理<span className="beta-msg">beta</span></span></Link>
          </Menu.Item>
        }
        {
          !this.hasPerssionManage() ? null : <Menu.Item key="map">
            <Icon type="line-chart"/><Link to="map" style={{display: "inline-flex"}}> <span className="nav-text">---</span></Link>
          </Menu.Item>
        }
        {
          !this.hasPerssionAPI() ? null : <Menu.Item key="api">
            <Icon type="link"/><Link to="api" style={{display: "inline-flex"}}> <span className="nav-text">---</span></Link>
          </Menu.Item>
        }

      </Menu>)
    let typeMenu = null;
    let pimTypes = this.props.pimTypes
    if (pimTypes != null && pimTypes.length > 0) {
      typeMenu = (
        <Menu key={this.state.newMenuDyKeyIdDy} theme="dark" mode="inline" defaultSelectedKeys={this.state.defaultSelectedKeysDy} onClick={this.handleClickMenuDy}>
          {pimTypes.map((item, i) => (
            <Menu.Item key={i + ""}>
              <Icon type="user"/><Link to={"types/" + item.typeShortName} style={{display: "inline-flex"}}><span className="nav-text">{item.typeName}</span></Link>
            </Menu.Item>))
          }
        </Menu>)
    }

    if (login) {
      return <div className={classnames("layout", "fold")}>
        <div className={"main"}>
          <HeaderC {...headerProps}/>
          <Layout>
            {/*<Sider collapsible collapsed={this.state.collapsed}  onCollapse={this.toggle}   breakpoint="lg" className="cus-sider" >*/}
            {/*<div className="logo"/>*/}
            {/*{typeMenu}*/}
            {/*{pintMenu}*/}
            {/*</Sider>*/}
            <Layout style={{minHeight: "calc(100vh - 85px)"}}>
              <Header style={{background: '#fff', padding: 0}}>
                <Icon
                  className="trigger"
                  type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                  onClick={this.toggle}
                />
              </Header>
              <Content style={{minHeight: 280, display: "flex", flexDirection: "column", flex: "auto"}}>
                {/*/margin: '24px 16px '/*/}
                <Content style={{background: '#fff', padding: 0, minHeight: 280, display: "flex"}}>
                  {/*{children||  <RaTable types={this.props.pimTypes} data={this.props.allItem}/>}*/}
                  {children || <div>
                    <ProductPage/>
                  </div>}
                  {/*<PimTypePage/>*/}
                  {/*<PimTypePage/>*/}
                </Content>
                {this.isRootPath() ? <Footer/> : null}

              </Content>
            </Layout>
          </Layout>
        </div>
      </div>
    } else {
      return (
        <div className={"spin"}>
          <Spin tip="加载用户信息..." spinning={loading} size="large">{loading ? <div></div> : <Login {...loginProps}/>}</Spin>
        </div>)
    }

  }
}

RootLayout.propTypes = {

  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  loginButtonLoading: PropTypes.bool,
  login: PropTypes.bool,
  user: PropTypes.object,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
}
//
//  {showBread ? <Bread location={location} menu={menu}/> : <div style={{height:"16px"}}/>}
export default connect(({app, typePage, itemPage, permission, upload}) => ({app, ...typePage, ...itemPage, ...upload, permissionList: permission.permissionList}))(RootLayout)
