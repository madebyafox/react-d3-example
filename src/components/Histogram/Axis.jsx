import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

//-------DIRTY TRICK LETS D3 MANIPULATE DOM
// I’m sure this goes against everything React designers fought for, but it works. We hook into the componentDidUpdate and componentDidMount callbacks with a renderAxis method. This ensures renderAxis gets called every time our component has to re-render.
// In renderAxis, we use ReactDOM.findDOMNode() to find this component’s DOM node. We feed the node into d3.select(),
//which is how node selection is done in d3 land, then .call() the axis. The axis then adds a bunch of SVG elements
//inside our node. As a result, we re-render the axis from scratch on every update. This is inefficient because
//it goes around React’s fancy tree diffing algorithms, but it works well enough.

export default class Axis extends Component {

  constructor(props) {
    super(props);
    console.log('here are my props in axis', this.props)
    this.yScale = d3.scale.linear();
    this.axis = d3.svg.axis()
                      .scale(this.yScale)
                      .orient("left")
                      .tickFormat((d) => "$"+this.yScale.tickFormat()(d));
    this.update_d3(props);
  }

  componentWillReceiveProps(newProps) {
        this.update_d3(newProps);
  }

  update_d3(props) {

    this.yScale
            .domain([0,
                     d3.max(props.data.map((d) => d.x+d.dx))])
            .range([0, props.height-props.topMargin-props.bottomMargin]);
        this.axis
            .ticks(props.data.length)
            .tickValues(props.data
                             .map((d) => d.x)
                             .concat(props.data[props.data.length-1].x
                                    +props.data[props.data.length-1].dx));
  }

  //The dirty trick for embedding d3 renders
  componentDidUpdate() { this.renderAxis(); }
  componentDidMount() { this.renderAxis(); }
  renderAxis() {
    let node = ReactDOM.findDOMNode(this);
    d3.select(node).call(this.axis);
  }

  render() {
    let translate = `translate(${this.props.axisMargin-3}, 0)`;
    return (
      <g className="axis" transform={translate}> </g>
    );
  }
}
