
import React, { PropTypes } from 'react';
import "./MindChart.less"
import createG2 from 'g2-react';
import * as G2 from 'g2';
import * as _ from "lodash";

const Chart = createG2(chart => {
  G2.Shape.registShape('point', 'collapsed', {
    drawShape: function(cfg, group) {
      return drawNode(cfg, group, true)
    }
  });
  G2.Shape.registShape('point', 'expanded', {
    drawShape: function(cfg, group) {
      return drawNode(cfg, group, false);
    }
  });
  G2.Shape.registShape('point', 'leaf', {
    drawShape: function(cfg, group) {
      return drawNode(cfg, group, false, true);
    }
  });
  var data = chart.get('data').data;
  var Layout = G2.Layout;
  var Stat = G2.Stat;
  // 使用layout，用户可以自己编写自己的layout
  // 仅约定输出的节点 存在 id,x，y字段即可
  var layout = new Layout.Tree({
    nodes: data
  });
  var dx = layout.dx;
  var nodes = layout.getNodes();
  var edges = layout.getEdges();
  chart.animate(false);
  // 不显示title
  chart.tooltip({
    title: null
  });
  chart.legend('children', false);
  chart.legend('name', false);
  renderTree(nodes, edges, dx, chart);
  chart.on('plotclick', function(ev){
    var shape = ev.shape;
    if (shape) {
      var obj = shape.get('origin');
      var id = obj._origin.id;
      var node = layout.findNode(id);
      if (node && node.children) {
        node.collapsed = !node.collapsed ? 1 : 0;
        layout.reset();
        nodes = layout.getNodes();
        edges = layout.getEdges();
        dx = layout.dx;
        // edgeView.changeData(edges);
        renderTree(nodes, edges, dx, chart);
      }
    }
  });
});

const widthObj={}
/**
 * 计算特殊节点长度大小
 * 由于等宽字体的原因,需要修正
 * */
function strLen(str) {

  var len = 0;
  var bigLen=0;
  for (var i = 0; i < str.length; i ++) {
    if(str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
      if(str.charCodeAt(i)<97 && str.charCodeAt(i)>65){
        bigLen++
      }
      len ++;
    } else {
      len += 2;
    }
  }
  return len+bigLen/2;
}
function drawNode(cfg, group, collapsed, isLeaf) {
  var x = cfg.x;
  var y = cfg.y;
  var pointSize = 5;
  var width = cfg.size;
  var height = 18;
  var label = cfg.label;
  var shape = group.addShape('rect', {
    attrs: {
      x: x,
      y: y - height / 2 ,
      width: width,
      height: height,
      fill: '#fff',
      cursor: isLeaf ? '' : 'pointer',
      stroke: cfg.color
    }
  });
  if (!isLeaf) {
    x = x - pointSize;
    group.addShape('circle', {
      attrs: {
        r: pointSize,
        x: x,
        y: y,
        fill: '#fff',
        stroke: cfg.color // 可以直接设置颜色 cfg.color，也可以使用映射
      }
    });
    var path = [];
    path.push(['M', x - pointSize/2, y]);
    path.push(['L', x + pointSize/2, y]);
    if (collapsed) {
      path.push(['M', x, y - pointSize/2]);
      path.push(['L', x, y + pointSize/2]);
    }
    group.addShape('path', {
      attrs: {
        path: path,
        stroke: cfg.color
      }
    });
  }
  return shape;
}

function renderTree(nodes, edges, dx, chart) {
  chart.clear();
  var height = Math.max(500, 26 / dx); // 最小高度 500
  chart.changeSize(1000, height);
  // 首先绘制 edges，点要在边的上面
  // 创建单独的视图
  var Stat = G2.Stat;
  var edgeView = chart.createView();
  edgeView.coord().transpose()
  edgeView.source(edges);
 // edgeView.coord().transpose().scale(1, -1); //
  edgeView.axis(false);
  edgeView.tooltip(false);
  // Stat.link 方法会生成 ..x, ..y的字段类型，数值范围是 0-1
  edgeView.edge()
    .position(Stat.link('source*target',nodes))
    .shape('smooth')
    .color('#ccc');

  // 创建节点视图
  var nodeView = chart.createView();
  nodeView.coord().transpose()
 // nodeView.coord().transpose().scale(1, -1); //'polar'
  nodeView.axis(false);
  // 节点的x,y范围是 0，1
  // 因为边的范围也是 0,1所以正好统一起来
  nodeView.source(nodes, {
    x: {min: 0,max:1},
    y: {min: 0, max:1},
    value: {min: 0}
  },['id','x','y','name','children','collapsed','typeId']); // 由于数据中没有 'collapsed' 字段，所以需要设置所有的字段名称
  nodeView.point().position('x*y').color('steelblue').size('name', function(name) {
    if(widthObj[name]!=null){
      return widthObj[name]+ 5 * 2
    }
    let length = strLen(name);
    return length * 6 + 5 * 2;
  }).label('name', {
    offset: 6,
    labelEmit: true
  })
    .shape('children*collapsed', function(children,collapsed) {
      if (children) {
        if (collapsed) {
          return 'collapsed';
        } else {
          return 'expanded';
        }
      }
      return 'leaf';
    })
    .tooltip('name*id*typeId');
  chart.on('tooltipchange',function(ev){

    if(ev.items){
      for(let s of ev.items){
        if(s.name=="name"){
          s.name="名称"
        }
      }
    }
  });
  chart.render();
}
const flattenChildren=(data)=>{
  let out=[]
  for(let sk of data){
    out.push({name:sk.name})
    if(sk.children&& sk.children.length>0){
      out=out.concat(out,flattenChildren(sk.children))
    }
  }
  return out
}
export default class MindChartFlod extends React.Component {
  state={
    data: [{"name":"flare","children":[{"name":"analytics","children":[{"name":"cluster","children":[{"name":"AgglomerativeCluster","size":3938},{"name":"CommunityStructure","size":3812},{"name":"HierarchicalCluster","size":6714},{"name":"MergeEdge","size":743}]},{"name":"graph","children":[{"name":"BetweennessCentrality","size":3534},{"name":"LinkDistance","size":5731},{"name":"MaxFlowMinCut","size":7840},{"name":"ShortestPaths","size":5914},{"name":"SpanningTree","size":3416}]},{"name":"optimization","children":[{"name":"AspectRatioBanker","size":7074}]}]},{"name":"animate","children":[{"name":"Easing","size":17010},{"name":"FunctionSequence","size":5842},{"name":"interpolate","children":[{"name":"ArrayInterpolator","size":1983},{"name":"ColorInterpolator","size":2047},{"name":"DateInterpolator","size":1375},{"name":"Interpolator","size":8746},{"name":"MatrixInterpolator","size":2202},{"name":"NumberInterpolator","size":1382},{"name":"ObjectInterpolator","size":1629},{"name":"PointInterpolator","size":1675},{"name":"RectangleInterpolator","size":2042}]},{"name":"ISchedulable","size":1041},{"name":"Parallel","size":5176},{"name":"Pause","size":449},{"name":"Scheduler","size":5593},{"name":"Sequence","size":5534},{"name":"Transition","size":9201},{"name":"Transitioner","size":19975},{"name":"TransitionEvent","size":1116},{"name":"Tween","size":6006}]}]}],
    forceFit: true,
    width: 500,
    height: 450,
    plotCfg: {
      margin: [20,50]
    },
    widthData:[]
  }

  handleClick = (event) => {
    if( this.props.onClick)
      this.props.onClick(event);
  };
  handleChange=(event)=>{
    this.setState({value:event.target.value})
    if(this.props.onChange)
      this.props.onChange(event.target.value)
  }
  initData=(props)=>{
    if(props.data!=null){
      let newdata=[...props.data]
      this.setState({data:props.data,flattenData:flattenChildren(props.data)})
    }
    setTimeout(()=>{
      this.ComputeFontWidth()
    },500)
  }
  componentDidMount=()=>{
    this.initData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.initData(nextProps)
  }
  /*修正数据长度值,临时方案*/
  ComputeFontWidth=()=> {

    if(this.refs){
      let widthObj2={}
      for(let nn of this.state.flattenData){
        let dom=this.refs[nn.name]
        if(dom!=null){
          widthObj[nn.name]=dom.offsetWidth
          widthObj2[nn.name]=dom.offsetWidth
        }
      }
      this.setState({widthObj2})
    }
  }



    render() {
    return (
      <div>

         <span className="hide-mirr">
           {
             this.state.flattenData&&this.state.flattenData.map((item,i)=>{
               return <span ref={item.name} key={i}>{item.name}</span>
             })
           }
         </span>
        <Chart key={Math.random()}
          data={this.state.data}
          width={this.state.width}
          height={this.state.height}
          plotCfg={this.state.plotCfg}
          forceFit={this.state.forceFit} />
      </div>
    )
  }
}

