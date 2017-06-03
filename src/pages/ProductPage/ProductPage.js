import React, {PropTypes} from 'react';
import {connect} from 'dva';

import {Layout} from "antd"
import  "./ProductPage.less"
import ProCard from "../../components/ProductCard/ProductCard";


class ProductPage extends React.Component {
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

ProductPage.propTypes = {projectList: PropTypes.array};

export default connect(({product}) => product)(ProductPage);
