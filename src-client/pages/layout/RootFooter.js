import React from 'react'
import {config} from '../../utils'
import {Link} from 'dva/router'
import request from "../../utils/request";


export default class RootFooter extends React.Component {
  constructor() {
    super();
    this.state = {}
    this.state.gaCore = null
    this.state.gaMock = null

    window.addEventListener('resize', () => {

      this.state._mounted && this.forceUpdate && this.forceUpdate();
    })
  }

  componentDidMount = () => {
    this.state._mounted = true
    this.forceUpdate && this.forceUpdate()
    /*  this.ajaxGa()
      setInterval(()=>{
        this.ajaxGa();
      },10*1000)*/
    //this.refs
  }
  ajaxGa = () => {
    // request("/_mock_/ga_core.rest",{}).done((a,b)=>{
    //    console.log(a,'--',b) //获取下列表绘图
    // })
    // request("/_mock_/ga.rest",{}).done((a,b)=> {
    //   console.log(a,'--',b)
    // })
    request("/_mock_/ga_interval.rest", {}).done((a, b) => {
      if (this.state._mounted)
        this.setState({gaCore: a.coreSystem, gaMock: a.mockSystem})
    })
  }
  componentWillUnmount = () => {
    this.state._mounted = false
  }

  render = () => {
    let dom = document.getElementById("__main__");
    let style;
    if (dom) {
      let mainHeight = dom.offsetHeight;
      let windowHeight = document.body.clientHeight;
      if (windowHeight > (mainHeight + 150)) {
        style = {position: "fixed", bottom: "0px"}
      }
    }
    if (document.body.clientHeight < 500)
      return null
    else
      return <div className={"footer"} style={style} ref="foot">
        <Link to={"/about"}>{config.footerText}</Link>
        {
          this.state.gaCore ? <span className="ga-footer">转发量(月天时分):
            <span>{this.state.gaCore.totalCountMonth} </span>
            <span>{this.state.gaCore.totalCountDay} </span>
            <span>{this.state.gaCore.totalCountHour} </span>
            <span>{this.state.gaCore.totalCountMinute} </span>
          </span> : null

        }
        {
          this.state.gaMock ? <span className="ga-footer ga-footer-r">访问量(月天时分):
            <span>{this.state.gaMock.totalCountMonth} </span>
            <span>{this.state.gaMock.totalCountDay} </span>
            <span>{this.state.gaMock.totalCountHour} </span>
            <span>{this.state.gaMock.totalCountMinute} </span>
          </span> : null

        }
      </div>
  }

}

