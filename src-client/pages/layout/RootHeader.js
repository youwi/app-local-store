import React from 'react'


import Icon from 'antd/lib/icon';
import Menu from 'antd/lib/menu';
import {Link} from 'dva/router'
import config from "../../../config"

const SubMenu = Menu.SubMenu


export default class RootHeader extends React.Component {

  render = () => {
    let {user, logout} = this.props
    let handleClickMenu = e => e.key === 'logout' && logout()

    return (
      <div className={"header"}>
        <Link to={"/"}>
          <div className={"siderbutton"}><i className="fa fa-pied-piper-alt fa-15x" aria-hidden="true"/>{config.logoText}</div>
        </Link>
        <Menu className="menu" mode="horizontal" onClick={handleClickMenu}>
          <SubMenu style={{float: 'right'}} title={<span>{user.name}<Icon type="user"/></span>}>

            <Menu.Item key="logout">
              <a>注销</a>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    )
  }
}
