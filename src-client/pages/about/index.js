/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import request from "../../utils/request";
const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const mdsource=require('./index.md')
const Base64 = require('js-base64').Base64;

import "./about.less"
class AboutPage extends React.Component {
  constructor(){
    super()
    this.state={}
  }
  componentDidMount() {

    // this.ajaxGa()
    // setInterval(()=>{
    //   this.ajaxGa()
    // },10*1000)
  }
  ajaxGa=()=>{
    // request("/_mock_/ga_core.rest",{}).done((a,b)=>{
    //    console.log(a,'--',b) //获取下列表绘图
    // })
    // request("/_mock_/ga.rest",{}).done((a,b)=> {
    //   console.log(a,'--',b)
    // })
    request("/_mock_/ga_interval.rest",{}).done((a,b)=> {
        this.setState({gaCore:a.coreSystem,gaMock:a.mockSystem})
    })
  }

  render() {
    const md = new MarkdownIt({
      html: true,
      linkify: true,
      highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (err) { console.error(err.stack); } // eslint-disable-line no-console
        }
        try {
          return hljs.highlightAuto(str).value;
        } catch (err) { console.error(err.stack); } // eslint-disable-line no-console
        return '';
      },
    });
    let html=""

    if(mdsource!=null && mdsource.split!=null){
      if(mdsource.split("base64,").length>0)
        html=md.render( Base64.decode(mdsource.split("base64,")[1]));
    }

    return (
          <div style={{paddingLeft:'100px'}} className="about">
            <div dangerouslySetInnerHTML={{ __html: html }} />
            {
              this.state.gaCore?<div className="ga-panel">转发接口访问:
            <span>最后一个月访问次数:{this.state.gaCore.totalCountMonth}</span>
            <span>今天一天总访问次数:{this.state.gaCore.totalCountDay}</span>
            <span>最近一小时访问次数:{this.state.gaCore.totalCountHour}</span>
            <span>最近一分钟访问次数:{this.state.gaCore.totalCountMinute}</span>
          </div>:null

            }
            {
              this.state.gaMock?<div className="ga-panel">Mock平台本身:
            <span>最后一个月访问次数:{this.state.gaMock.totalCountMonth}</span>
            <span>今天一天总访问次数:{this.state.gaMock.totalCountDay}</span>
            <span>最近一小时访问次数:{this.state.gaMock.totalCountHour}</span>
            <span>最近一分钟访问次数:{this.state.gaMock.totalCountMinute}</span>
          </div>:null

            }
          </div>
    );
  }

}

export default AboutPage;
