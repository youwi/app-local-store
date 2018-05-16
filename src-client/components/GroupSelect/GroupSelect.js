/**
 * Created by yu on 2017/4/21.
 */

import {connect} from 'dva'
import  {Tooltip, Select,Collapse,Icon,Menu,Dropdown,Input} from "antd"
import React, {PropTypes} from 'react'
import {isStringLike} from "../../utils/ArrayUtil";
const Panel = Collapse.Panel;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import "./group_select.less"
export class GroupSelect extends React.Component {
  static SelectOptGroup = true;

  componentDidMount=()=>{
    this.setState({data:this.props.data,dataBackup:this.props.data,search: this.findValueByKey2(this.props.data,this.props.defaultValue)})
  }
  componentWillReceiveProps(props) {

    this.setState({data:props.data,dataBackup:props.data,search: this.findValueByKey2(props.data,props.defaultValue)})
  }
  state={
    search:"",
    dataBackup:[],
    data:[{key:"",name:"",sub:[{key:"",value:""}]}],
    value:""
  }
  findValueByKey=(key)=>{
    for(let g of this.state.data){
      for(let a of g.sub){
        if(a.key==key){
          return a.value
        }
      }
    }
  }
  findValueByKey2=(data,key)=>{

    for(let g of  data){
      for(let a of g.sub){
        if(a.key==key){
          return a.value
        }
      }
    }
  }
  filterLike=(text)=>{
    let newdata=[]
    for(let g of this.state.dataBackup){
      let found=false
      let newg={key:g.key,name:g.name,sub:[]}
      for(let a of g.sub){
        if(this.objectLike(a,text)){
          found=true
          newg.sub.push(a)
        }
      }
      if(found){
        newdata.push(newg)
      }
    }
    this.setState({data:newdata})
  }
  objectLike(obj,text){
    if(obj==null) return false
    let str=""+obj.key+obj.value
    if(str.indexOf(text)>-1) return true

  }

  handleClick=(v)=>{
    this.setState({search:this.findValueByKey(v.key)},()=>{
      this.props.onChange&&this.props.onChange(v.key)
    })
  }
  handleChangeSearchText=(ve)=>{
    let value=""
    if(ve.target){
        value=ve.target.value
    }
    this.filterLike(value)
    this.setState({search:value},()=>{
      this.props.onChange&&this.props.onChange(value)
    })

  }
  //onSelect	被选中时调	Function({ item, key, selectedKeys })
  render(){

    let menu=<Menu onClick={this.handleClick} style={{ width: 240 }} defaultSelectedKeys={[this.state.value]} defaultOpenKeys={['sub1']} mode="inline">
      {this.state.data.map((g,i)=>(<SubMenu  key={g.key||i} title={<span><span>{g.name}</span></span>}>
        {g.sub.map((a,j)=>(<Menu.Item key={a.key||j}>{a.value}</Menu.Item>))}
      </SubMenu>))
      }
    </Menu>
    return <div className="group-select">

      <Dropdown overlay={menu} trigger={['click']} overlayClassName="group-select">
        <Input placeholder="请选择" value={this.state.search} onChange={this.handleChangeSearchText} />
      </Dropdown>
    </div>
  }
}
//<Icon type="tag" />
