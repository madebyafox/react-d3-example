import React, { Component } from 'react';
import d3 from 'd3';


class Histogram extends Component {
  constructor(props) {
    super();

    //Going to use builtin d3 histogram layout for the graph, but unforunately because we are using react
    //and want to let react maintain the state, we want to avoid using the .value() accessor which would normally update
    //the layout based on the values of our data
    //Combining D3 with react we mitigate this isue by relying on 3 methods (from Swizec Teller):
    //(1) the constructor -- create d3 objects and any defaults, then calls update_d3 to set d3 Obj properties based on component props
    //(2) componentWillReceiveProps -- call update_d3 anytime props change
    //(3) update_d3 -- updates the d3 objects using the current component properties

    this.histogram = d3.layout.histogram() //going to use d3 builtin histogram layout
    this.widthScale = d3.scale.linear()
    this.yScale = d3.scale.linear()
    this.update_d3(props) // <- set the value of the d3 objects for the graph based on the component props
  }

  componentWillReceiveProps(newProps) {// <-- everytime new props are received, update d3 objs
    this.update_d3(newProps);
  }

  update_d3(props){// <-- actually update the d3 object properties
    this.histogram
      .bins(props.bins)
      .value(props.value);

    let bars = this.histogram(props.data),
        counts = bars.map( (d) => d.y );

    this.widthScale
      .domain([d3.min(counts), d3.max(counts)])
      .range([9, props.width-props.axisMargin]);

    this.yScale
      .domain([0, d3.max(bars.map((d) => d.x + d.dx))])
      .range([0, props.height-props.topMargin-props.bottomMargin]);

    console.log(bars);
  }

  makeBar(bar) {
    let percent = bar.y/this.props.data.length*100;

    let props = {
      percent: percent,
      x: this.props.axisMargin,
      y: this.yScale(bar.x),
      width: this.widthScale(bar.y),
      height: this.yScale(bar.dx),
      key: 'histogram-bar-'+bar.x+'-'+bar.y
    };

      return (
          <HistogramBar {...props} />
      );
  }

  render() {
    let translate = `translate(0, ${this.props.topMargin})`,
        bars = this.histogram(this.props.data);

    return (
      <g className="histogram" transform={translate}>
        <g className="bars">
          {bars.map(::this.makeBar)}
        </g>
      </g>
    );
  }
}

class HistogramBar extends Component {
  render() {
    let translate = `translate(${this.props.x}, ${this.props.y})`,
        label = this.props.percent.toFixed(0) + '%';

    if (this.props.percent < 1) {
        label = this.props.percent.toFixed(2)+'%';
    }

    if (this.props.width < 20) {
      label = label.replace('%', '');
    }

    if (this.props.width < 10) {
      label = '';
    }

    return (
      <g className="bar" transform={translate}>
        <rect width={this.props.width} height={this.props.height-2} transform="translate(0, 1)"></rect>
        <text textAnchor="end" x={this.props.width-5} y={this.props.height/2+3}>{label}</text>
      </g>
    )
  }
}

export default Histogram;
