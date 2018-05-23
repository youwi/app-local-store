import React from 'react';
import {connect} from 'dva';

import "./TimeLine.less"
import ProCard from "../../components/ProductCard/ProductCard";


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
        <ProCard cardList={this.props.products} selectProject={this.onSelect}/>
      </div>
    )
  }
}

export default connect(({product}) => product)(TimeLinePage);
