import React, {PropTypes} from 'react';
import {connect} from 'dva';

import {Layout} from "antd"
import  "./ProductPage.less"
import ProCard from "../../components/ProductCard/ProductCard";
import DropZone from "../../components/DropZone/DropZone";
import PreviewBox from "../../components/PreviewBox/PreviewBox";

class VersionsPage extends React.Component {
  state = {
    collapsed: true
  }

  constructor(props) {
    super();
  }

  onSelect = (name) => {
    this.props.dispatch({type: "product/pureUpdate", deviceList: []})
    this.props.dispatch({type: "product/pureUpdate", currentProjectId: this.getProjectIdByProjectShortName(name), currentProject: name})
    this.props.dispatch({type: 'product/updateDeviceTable', projectId: this.getProjectIdByProjectShortName(name), projectShortName: this.props.currentProject})
    this.props.dispatch({type: "product/product", project: name})
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


  render = () => {
    return (

        <Layout >

            <Layout.Sider collapsible collapsed={this.state.collapsed} onCollapse={this.toggle} breakpoint="lg" className="cus-sider">
              <div className="logo"/>
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
