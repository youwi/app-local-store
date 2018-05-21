import React from 'react';
import PropTypes from 'prop-types';

import ReactDom from "react-dom"
import {connect} from 'dva';

import {Layout, Menu, Icon, Button, Tooltip} from "antd"
import "./VersionPage.less"

import DropZone from "../../components/DropZone/DropZone";
import {ip, httpip} from "../../env.json"
import FlowImgBox from "../../components/FlowImgBox/FlowImgBox";
import RootLayout from "../RootLayout";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const MODE = {uploadPage: "uploadPage", indexPage: "indexPage", imagesPage: "imagesPage"}

class VersionsPage extends React.Component {
  state = {

    collapsed: true,
    indexPage: null,
    showMode: "uploadPage", // ,imagesPage
  }


  constructor(props) {
    super();
  }

  getProductShortName = () => {
    let productShortName = ""
    if (this.props.params) {
      productShortName = this.props.params.productShortName
    } else if (this.props.match.params) {
      productShortName = this.props.match.params.productShortName
    }
    return productShortName
  }

  componentDidMount = () => {
    let dom = ReactDom.findDOMNode(this.refs.Content)
    if (dom != null) this.setState({contentHeight: dom.clientHeight})
    this.props.dispatch({type: "product/getProductVersions", product: this.getProductShortName()})
    if (this.props) {
    }
  }
  componentWillReceiveProps = (nextProp, currProp) => {
    if (nextProp.indexExist != true) {
      this.setState({showMode: MODE.imagesPage})
    }
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
  showAllImages = (e, version, tag) => {
    e.stopPropagation && e.stopPropagation()
    let product = this.getProductShortName()
    this.props.dispatch({type: "product/scanAllImages", product, version, tag})
    if (this.state.showMode == MODE.imagesPage)
      this.setState({showMode: MODE.indexPage})
    if (this.state.showMode == MODE.indexPage)
      this.setState({showMode: MODE.imagesPage})
  }
  dispatchVersionTagPreview = (item) => {
    let product = this.getProductShortName()
    let version = item.keyPath[1]
    let tag = item.key
    let indexPage = httpip + "/" + product + "/" + version + "/" + tag + "/" + "index.html"
    this.setState({indexPage, showMode: MODE.indexPage})

    this.props.dispatch({type: "product/scanAllImages", product, version, tag})
  }
  toggleShowMode = () => {
    this.setState({showMode: MODE.uploadPage})
  }

  buildMenu = (versions, versionT) => {
    if (versionT != null) {
      let out = []
      let keys = Object.keys(versionT);
      for (let version of keys.sort().reverse()) {
        let sub = versionT[version]
        out.push(<SubMenu key={version} title={<span style={{
          width: "100%",
          display: "inline-block"
        }} onClick={this.toggleShowMode}><Icon type="folder"/><span>{version}</span></span>}>
          {sub.map(name => <Menu.Item key={name}><span style={{width: "180px"}}>{name}</span>
            <Tooltip placement="top" title={"显示所有图片"}>
              <Icon className="menu-btn" style={{marginRight: "0px"}} type="link" onClick={(e) => this.showAllImages(e, version, name)}/>
            </Tooltip>
          </Menu.Item>)}
        </SubMenu>)
      }
      return <Menu theme="dark" mode="inline" defaultOpenKeys={[keys[0]]} onClick={this.dispatchVersionTagPreview}>{out}</Menu>
    }
  }
  upload = (obj) => {
    let nobj = {...obj}
    delete nobj.accepted
    let product = this.getProductShortName()

    this.props.dispatch({type: "upload/upload", ...nobj, files: obj.accepted, product})

    //刷新列表,
    this.props.dispatch({type: "product/getProductVersions", product})
  }

  render = () => {
    let iStyle = {
      borderWidth: '0px',
      minHeight: this.state.contentHeight || "500px",
      width: '100%',
      height: "calc(100vh - 41px)"
    }
    let contnetStyle = {background: "#FFF", padding: this.state.indexPage == null ? "12px" : "0px"}
    let showDom = "";
    if (this.state.showMode === MODE.indexPage) {
      showDom = <iframe src={this.state.indexPage} style={iStyle}/>
    } else if (this.state.showMode === MODE.uploadPage) {
      showDom = <div>
        <DropZone upload={this.upload} state={this.props.uploading}/>
        {/*<PreviewBox links={this.props.links}/>*/}
      </div>
    } else if (this.state.showMode === MODE.imagesPage) {
      showDom = <FlowImgBox links={this.props.allImages}/>
    }
    return (
      <RootLayout>
        <Layout>
          <Layout.Sider collapsible collapsed={this.state.collapsed} onCollapse={this.toggle} breakpoint="lg" className="cus-sider">
            <div style={{overflow: "scroll"}}>  {this.buildMenu(this.props.versions, this.props.versionT)}</div>

          </Layout.Sider>
          <Layout>
            <Layout.Content style={contnetStyle} ref="Content">
              {showDom}
            </Layout.Content>
          </Layout>
        </Layout>
      </RootLayout>

    )
  }
}

VersionsPage.propTypes = {projectList: PropTypes.array};

export default connect(({product, upload}) => {
  return {...product, ...upload}
})(VersionsPage);
