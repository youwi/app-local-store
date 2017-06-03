import React, {PropTypes} from 'react';
import {connect} from 'dva';

import {Layout,Menu,Icon} from "antd"
import  "./VersionPage.less"

import DropZone from "../../components/DropZone/DropZone";
import PreviewBox from "../../components/PreviewBox/PreviewBox";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
class VersionsPage extends React.Component {
  state = {
    collapsed: true
  }


  constructor(props) {
    super();
  }

  onSelect = (name) => {

  }
  getProjectIdByProjectShortName = (name) => {
    for (let item of this.props.products) {
      if (item.projectShortName == name)
        return item.id
    }
    return 0
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  buildMenu=(versions,versionT)=>{
    if(versionT!=null){
      let out=[]
      for(let version in versionT){
        let sub=versionT[version]
          out.push(<SubMenu key={version} title={<span><Icon type="mail" /><span>{version}</span></span>}>
            {sub.map(name=><Menu.Item key={name}>{name}</Menu.Item>)}
          </SubMenu>)
      }
      return <Menu theme="dark" mode="inline">{out}</Menu>

    }
    if(versions!=null && versions.constructor==Array){
      return <Menu    theme="dark"  mode="inline">
        {
          versions.map((version)=>{
           return  <SubMenu key={version} title={<span><Icon type="mail" /><span>{version}</span></span>}>
             <Menu.Item key="1">SIL</Menu.Item>
            </SubMenu>
          })
        }

      </Menu>
    }
    return <Menu
      onClick={this.handleClick}
     // style={{ width: 240 }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      theme="dark"
      mode="inline"
    >
      <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
        <MenuItemGroup key="g1" title="Item 1">
          <Menu.Item key="1">Option 1</Menu.Item>
          <Menu.Item key="2">Option 2</Menu.Item>
        </MenuItemGroup>
        <MenuItemGroup key="g2" title="Item 2">
          <Menu.Item key="3">Option 3</Menu.Item>
          <Menu.Item key="4">Option 4</Menu.Item>
        </MenuItemGroup>
      </SubMenu>
      <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
        <Menu.Item key="5">Option 5</Menu.Item>
        <Menu.Item key="6">Option 6</Menu.Item>
        <SubMenu key="sub3" title="Submenu">
          <Menu.Item key="7">Option 7</Menu.Item>
          <Menu.Item key="8">Option 8</Menu.Item>
        </SubMenu>
      </SubMenu>
      <SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
        <Menu.Item key="9">Option 9</Menu.Item>
        <Menu.Item key="10">Option 10</Menu.Item>
        <Menu.Item key="11">Option 11</Menu.Item>
        <Menu.Item key="12">Option 12</Menu.Item>
      </SubMenu>
    </Menu>
  }
  upload=(obj)=>{
    let nobj={...obj}
    delete nobj.accepted
    let product=this.props.params.productShortName
    this.props.dispatch({type:"upload/upload",...nobj,...obj.accepted,product})

    //刷新列表,
    this.props.dispatch({type: "product/getProductVersions", product})
  }

  render = () => {
    return (

        <Layout >

            <Layout.Sider collapsible collapsed={this.state.collapsed} onCollapse={this.toggle} breakpoint="lg" className="cus-sider">
              <div className="logo"/>
              <div style={{    overflow: "scroll"}}>  {this.buildMenu(this.props.versions,this.props.versionT)}</div>

            </Layout.Sider>


          <Layout>
            <Layout.Content style={{background:"#FFF",padding:"12px"}}>
              <DropZone upload={this.upload}/>
              <PreviewBox links={this.props.links}/>
            </Layout.Content>
          </Layout>

        </Layout>

    )
  }
}

VersionsPage.propTypes = {projectList: PropTypes.array};

export default connect(({product}) => product)(VersionsPage);
//({projectList})=>({projectList})
