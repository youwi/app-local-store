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
import Layout from 'antd/lib/layout';


const {Header, Content} = Layout;

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


  isRootPath = () => {
    if (document.body.clientHeight < 500)
      return false
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


    let tmp = []
    for (let i = 0; i < 100; i++) {
      tmp.push(<div key={i}>AAAAAAA</div>)
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
            <Layout style={{minHeight: "calc(100vh - 79px)"}}>
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

              </Content>
            </Layout>
          </Layout>
          {this.isRootPath() ? <Footer/> : null}

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
