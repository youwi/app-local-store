/**
 * Created by yu on 2017/3/2.
 */

import React from 'react';
import {Menu, Icon, Button, Row, Col, Card, Radio, Tooltip, Input} from 'antd'

import "brace";
import "brace/mode/json"
import "brace/mode/groovy"
import "brace/mode/javascript"
import "brace/mode/yaml"
import "brace/mode/xml"
import "brace/theme/dawn"
import "brace/theme/textmate"


import AceEditor from "react-ace"


export default class  ScriptEditor extends React.Component {

  saveAceChange=(value)=>{
    if(this.props.onSave!=null){
      this.props.onSave(value)
    }
  }

  render=()=>{
    let value=this.props.text
    if(value!=null){
      try {
        value = JSON.stringify(JSON.parse(value), null, 4)
      }catch (e){
        console.error(e)
      }
    }

    let aceEditor=(<AceEditor
      // mode={"javascript"}
      mode={"groovy"}
      theme="textmate"
      name="code"
      width="100%"
      height="100%"
      setOptions={{ 'showLineNumbers': false,showPrintMargin:false}}
      maxLines={30}
      minLines={20}
      ref="ace"
      fontSize={14}
      value={value}
      editorProps={{$blockScrolling: Infinity}}
      onChange={this.saveAceChange}
      readOnly={false}
      onLoad={(editor) => {
        editor.focus();
        editor.getSession().setUseWrapMode(true);
      }}
    />);
    return <div style={{borderTop:"1px solid rgba(204, 204, 204, 0.24) "}}>
       <span className="http-fun-buttons http-fun-buttons-single">
          <Tooltip placement="top" title={"立即保存"}>
            {/*<Button  size={"small"} onClick={this.changeContent}>Save</Button>*/}
            <Button  shape="circle" icon="save" style={{transform: "scale(1,1)"}} onClick={this.onSave}/>
          </Tooltip>
        </span>
      {aceEditor}
      </div>

  }
}
