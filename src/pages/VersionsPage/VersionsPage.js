import React, {PropTypes} from 'react';
import ReactDom from "react-dom"
import {connect} from 'dva';

import {Layout,Menu,Icon} from "antd"
import  "./VersionPage.less"

import DropZone from "../../components/DropZone/DropZone";
import PreviewBox from "../../components/PreviewBox/PreviewBox";
import {ip,httpip} from "../../env.json"
import config from "../../../config"
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
class VersionsPage extends React.Component {
  state = {
    collapsed: true,
    indexPage:null
  }


  constructor(props) {
    super();
  }
  componentDidMount=()=>{
   let dom= ReactDom.findDOMNode(this.refs.Content)
    if(dom!=null)  this.setState({contentHeight:dom.clientHeight})
    this.props.dispatch({type: "product/getProductVersions", product:this.props.params.productShortName})
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
  dispatchVersionTagPreview=(item)=>{
    let product=this.props.params.productShortName
    let version=item.keyPath[1]
    let tag=item.key
    let indexPage=httpip+"/"+product+"/"+version+"/"+tag+"/"+"index.html"
    this.setState({indexPage})

    this.props.dispatch({type:"product/scanAllImages",product,version,tag})
  }
  buildMenu=(versions,versionT)=>{
    if(versionT!=null){
      let out=[]
      for(let version in versionT){
        let sub=versionT[version]
          out.push(<SubMenu key={version} title={<span><Icon type="folder" /><span>{version}</span></span>}>
            {sub.map(name=><Menu.Item key={name}>{name}</Menu.Item>)}
          </SubMenu>)
      }
      return <Menu theme="dark" mode="inline" onClick={this.dispatchVersionTagPreview}>{out}</Menu>

    }

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
    let iStyle={
      borderWidth: '0px',
      minHeight:this.state.contentHeight||"500px",
      width:'100%'
    }
    return (

        <Layout >

            <Layout.Sider collapsible collapsed={this.state.collapsed} onCollapse={this.toggle} breakpoint="lg" className="cus-sider">
              <div className="logo"/>
              <div style={{    overflow: "scroll"}}>  {this.buildMenu(this.props.versions,this.props.versionT)}</div>

            </Layout.Sider>


          <Layout>
            <Layout.Content style={{background:"#FFF",padding:this.state.indexPage==null?"12px":"0px"}} ref="Content">
              {this.state.indexPage!=null?
                <iframe src={this.state.indexPage} style={iStyle}/>
                :<div>
                  <DropZone upload={this.upload}/>
                  <PreviewBox links={this.props.links}/>
                </div>
              }

            </Layout.Content>
          </Layout>

        </Layout>

    )
  }
}

VersionsPage.propTypes = {projectList: PropTypes.array};

export default connect(({product,upload}) =>{return {...product,...upload}})(VersionsPage);
//({projectList})=>({projectList})
