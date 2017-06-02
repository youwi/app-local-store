import React, { PropTypes } from 'react'
import { Menu, Icon, Button } from 'antd'
import { Link } from 'dva/router'
import styles from './layout.less'
import config from "../../../config"

const SubMenu = Menu.SubMenu

export default function Header({  user, logout, switchSider, siderFold }) {
  let handleClickMenu = e => e.key === 'logout' && logout()
  return (
    <div className={styles.header}>
{/*   <div className={styles.siderbutton} onClick={switchSider}>
        <Icon type={siderFold?"menu-unfold":"menu-fold"} />
      </div>*/}

      <Menu className="header-menu" mode="horizontal" onClick={handleClickMenu}>
        <Link to={"/"}> <div className={styles.siderbutton}><i className="fa fa-pied-piper-alt fa-15x" aria-hidden="true"/> {config.logoText}</div></Link>
        <SubMenu style={{ float: 'right' }} title={<span>{user.name}<Icon type="user"/></span>} >
          <Menu.Item key="logout">
            <a>注销</a>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </div>
  )
}

//  <i className="anticon icon-home"/>
