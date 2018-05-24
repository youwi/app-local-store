import React from 'react';
import {connect} from 'dva';

import "./TimeLine.less"
import Timeline from "antd/es/timeline/Timeline";
import "antd/lib/timeline/style";
import RootLayout from "../RootLayout";
import Layout from "antd/lib/layout";

class TimeLinePage extends React.Component {
  state = {}

  constructor(props) {
    super();
  }

  onSelect = (name) => {
    this.props.dispatch({type: "device/pureUpdate", deviceList: []})
    this.props.dispatch({type: "device/pureUpdate", currentProjectId: this.getProjectIdByProjectShortName(name), currentProject: name})
    this.props.dispatch({type: "product/getProductVersions", product: name})
  }
  getProjectIdByProjectShortName = (name) => {
    if (this.props.products == null)
      return 0
    for (let item of this.props.products) {
      if (item.projectShortName == name)
        return item.id
    }
    return 0
  }


  render = () => {
    return (
      <div>
      <Layout >
        <Layout.Sider className={'hidden-sider'}>Sider</Layout.Sider>
        <Layout>
          <Layout.Header>Header</Layout.Header>
          <Layout.Content>
            <Layout>
              <Layout.Header>Header</Layout.Header>
              <Layout.Content>
                <Timeline>
                  <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                  <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                  <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                  <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                </Timeline>
                <Timeline>
                  <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                  <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                  <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                  <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                </Timeline>
              </Layout.Content>
            </Layout>


          </Layout.Content>
        </Layout>
        <Layout.Sider className={'hidden-sider'}>Sider</Layout.Sider>
      </Layout>
      </div>

    )
  }
}

export default connect(({product}) => product)(TimeLinePage);
//       <RootLayout>
