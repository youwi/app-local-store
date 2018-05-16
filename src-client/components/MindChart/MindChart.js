
import React, { PropTypes } from 'react';
import "./MindChart.less"
import createG2 from 'g2-react';
import * as G2 from 'g2';
const Chart = createG2(chart => {
  var Layout = G2.Layout;
  var Stat = G2.Stat;
  // 不显示title
  chart.tooltip({
    title: null
  });
  // 不显示图例
  chart.legend(false);
  var data = chart.get('data').data;
  // 使用layout，用户可以自己编写自己的layout
  // 仅约定输出的节点 存在 id,x，y字段即可
  var layout = new Layout.Tree({
    nodes: data
  });
  var nodes = layout.getNodes();
  var edges = layout.getEdges();
  // 首先绘制 edges，点要在边的上面
  // 创建单独的视图
  var edgeView = chart.createView();
  edgeView.source(edges);
  edgeView.coord().transpose();
  edgeView.axis(false);
  edgeView.tooltip(false);
  // Stat.link 方法会生成 ..x, ..y的字段类型，数值范围是 0-1
  edgeView.edge()
    .position(Stat.link('source*target',nodes))
    .shape('smooth')
    .color('#ccc');
  // 创建节点视图
  var nodeView = chart.createView();
  nodeView.coord().transpose();
  nodeView.axis(false);
  // 节点的x,y范围是 0，1
  // 因为边的范围也是 0,1所以正好统一起来
  nodeView.source(nodes, {
    x: {min: 0,max:1},
    y: {min: 0, max:1},
    value: {min: 0}
  });
  nodeView.point().position('x*y').color('steelblue').size(3).label('name', {
    offset: 5,
    labelEmit: true
  })
    .tooltip('name');
  chart.render();
});

export default class MindChart extends React.Component {
  state={
    value:this.props.value,
    data: [{"name":"flare","children":[{"name":"analytics","children":[{"name":"cluster","children":[{"name":"AgglomerativeCluster","size":3938},{"name":"CommunityStructure","size":3812},{"name":"HierarchicalCluster","size":6714},{"name":"MergeEdge","size":743}]},{"name":"graph","children":[{"name":"BetweennessCentrality","size":3534},{"name":"LinkDistance","size":5731},{"name":"MaxFlowMinCut","size":7840},{"name":"ShortestPaths","size":5914},{"name":"SpanningTree","size":3416}]},{"name":"optimization","children":[{"name":"AspectRatioBanker","size":7074}]}]},{"name":"animate","children":[{"name":"Easing","size":17010},{"name":"FunctionSequence","size":5842},{"name":"interpolate","children":[{"name":"ArrayInterpolator","size":1983},{"name":"ColorInterpolator","size":2047},{"name":"DateInterpolator","size":1375},{"name":"Interpolator","size":8746},{"name":"MatrixInterpolator","size":2202},{"name":"NumberInterpolator","size":1382},{"name":"ObjectInterpolator","size":1629},{"name":"PointInterpolator","size":1675},{"name":"RectangleInterpolator","size":2042}]},{"name":"ISchedulable","size":1041},{"name":"Parallel","size":5176},{"name":"Pause","size":449},{"name":"Scheduler","size":5593},{"name":"Sequence","size":5534},{"name":"Transition","size":9201},{"name":"Transitioner","size":19975},{"name":"TransitionEvent","size":1116},{"name":"Tween","size":6006}]}]}],
    forceFit: true,
    width: 500,
    height: 450,
    plotCfg: {
      margin: [20,50]
    },
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
  componentDidMount=()=>{
    if(this.props.data!=null)
      this.setState({data:this.props.data})
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.data!=null)
      this.setState({data:nextProps.data})
  }


  render() {
    return (
        <div>
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

