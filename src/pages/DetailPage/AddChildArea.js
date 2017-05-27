import React, {PropTypes} from 'react';
import {Icon, Popover, Select, Button, Tooltip, Modal,Input} from "antd"

import {objectUrlEncode} from "../../utils/ArrayUtil";
const InputGroup = Input.Group;
var md5 = require('md5');
const Option = Select.Option
export default class AddChildArea extends React.Component {

  state = {
     disabled:true
  }
  componentDidMount = () => {

  }
  handleOkAddChild = () => {
    let item={
      "itemId": Math.ceil(Math.random() * 10000 * -1),
      key: Math.ceil(Math.random() * 10000 * -1),
      "typeId": this.state.typeId,
      "itemMainParentId": this.props.parentId,
      "itemBlockIds": null,
      "itemMultiParentIds": null,
      "itemName": this.state.name,
      "itemShortName":this.state.shortName, //md5(this.state.name,16).substr(0,8),
      "itemDesc": "",
      "itemProps": null,
      _editable: true,
    }
    this.props.onSave&&this.props.onSave(item)
  }

  buildTypeList = () => {
    return this.props.pimTypes.map((item, i) => (<Select.Option key={item.typeId} value={item.typeId+""}>{item.typeName}</Select.Option>))
  }
  selectType=(v)=>{
    this.setState({typeId:v})
  }
  findTypeChildTypeId=()=>{
    let typeId=this.props.parentTypeId
    for(let s of this.props.pimTypes){
      if(s.typeMainParentId==typeId){
        this.state.typeId=s.typeId
        return s.typeId
      }
    }
    return null
  }
  changeName=(name)=>{
    this.state.name=name
    this.setState({name})
    this.checkRequire()
  }
  changeShortName=(name)=>{
    this.state.shortName=name
    this.setState({shortName:name})
    this.checkRequire()
  }
  checkRequire=()=>{
    let disabled=false
    if(this.state.shortName==null || this.state.shortName=="") disabled=true
    if(this.state.name==null || this.state.name=="") disabled=true
    this.setState({disabled})
  }


  render() {
    let defaultValue=this.findTypeChildTypeId()||<span className="like-placehodler">可选分类</span>
    if(defaultValue.constructor==Number){
      defaultValue=defaultValue+""
    }



    return (
      <Modal
        visible={this.props.visible}
        title="快速添加子类"
        onOk={this.handleOk}
        onCancel={this.props.toggleShowModal}
        footer={[
          <Button key="submit" type="primary"  disabled={this.state.disabled} loading={this.state.loading} onClick={this.handleOkAddChild}>确认</Button>,
        ]}
      >
        <div className="add-child-area">
          <InputGroup compact>
            <Input style={{ width: '40px' }} disabled={true}  value={"类别"}/>
            <Select
              showSearch
              allowClear={true}
              disabled={this.findTypeChildTypeId()!=null}
              defaultValue={defaultValue}
              style={{width: "40%"}}
              placeholder="可选分类"
              optionFilterProp="children"
              onChange={this.selectType}
              filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
              {this.buildTypeList()}
            </Select>
          </InputGroup>
          <InputGroup compact>
            {/*<Select defaultValue="Option1">*/}
              {/*<Option value="Option1">类型</Option>*/}
            {/*</Select>*/}
            <Input style={{ width: '40px' }} disabled={true}  value={"名称"}/>
            <Input placeholder="请填写名称" style={{ width: '40%' }} value={this.state.name}  onChange={(e)=>this.changeName(e.target.value)} />
          </InputGroup>
          <InputGroup>
            <Input style={{ width: '40px' }} disabled={true}  value={"缩写名"}/>
            <Input placeholder="请填写缩写名称" style={{ width: '40%' }} value={this.state.shortName}  onChange={(e)=>this.changeShortName(e.target.value)} />
          </InputGroup>

        </div>
        <div> </div>


      </Modal>)
  }

}
// addonBefore={<span>名称</span>}
