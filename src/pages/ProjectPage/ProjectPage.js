import React ,{ PropTypes } from 'react';
import { connect } from 'dva';
import ProCard from "../../components/ProCard/ProCard"
import styles from "./ProjectPage.less"

class  ProjectPage extends  React.Component {
  constructor(props){
    super();
  }
  onSelect=(name)=>{
    this.props.dispatch({type:"device/pureUpdate",deviceList:[]})
    this.props.dispatch({type:"device/pureUpdate",currentProjectId:this.getProjectIdByProjectShortName(name),currentProject:name})
    this.props.dispatch({type:'device/updateDeviceTable',projectId:this.getProjectIdByProjectShortName(name),projectShortName:this.props.currentProject})
    this.props.dispatch({type:"realtime/selectproject",project:name})
  }
  getProjectIdByProjectShortName=(name)=>{
    for(let item of this.props.projectList){
      if(item.projectShortName==name)
        return item.id
    }
    return 0
  }


  render = () => {
    return (
      <div className={styles.normal}>
        <ProCard cardList={this.props.projectList} selectproject={this.onSelect}/>
      </div>
    )
  }
}

ProjectPage.propTypes = {projectList:PropTypes.array};

export default connect(({project})=>project)(ProjectPage);
//({projectList})=>({projectList})
