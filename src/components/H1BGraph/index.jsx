import React, { Component } from 'react';
import d3 from 'd3';
import Histogram from '../Histogram/index.jsx';

class H1BGraph extends Component {
  constructor() {
    super();

    this.state = {
      rawData: []
    };
  }

  componentWillMount() {
    this.loadRawData();
  }

  //DATA cleaning helper to categorize job titles
  cleanJobs(title) {
      title = title.replace(/[^a-z ]/gi, '');
      if (title.match(/consultant|specialist|expert|prof|advis|consult/)) {
          title = "consultant";
      }else if (title.match(/analyst|strateg|scien/)) {
          title = "analyst";
      }else if (title.match(/manager|associate|train|manag|direct|supervis|mgr|chief/)) {
          title = "manager";
      }else if (title.match(/architect/)) {
          title = "architect";
      }else if (title.match(/lead|coord/)) {
          title = "lead";
      }else if (title.match(/eng|enig|ening|eign/)) {
          title = "engineer";
      }else if (title.match(/program/)) {
          title = "programmer";
      }else if (title.match(/design/)) {
          title = "designer";
      }else if (title.match(/develop|dvelop|develp|devlp|devel|deelop|devlop|devleo|deveo/)) {
          title = "developer";
      }else if (title.match(/tester|qa|quality|assurance|test/)) {
          title = "tester";
      }else if (title.match(/admin|support|packag|integrat/)) {
          title = "administrator";
      }else{
          title = "other";
      }
      return title;
  }

  loadRawData() {// load raw data here - custom function for flexibility
    let dateFormat = d3.time.format('%m/%d/%Y');

    // asynchronously loads CSV file, parse it, and return the result in the 'rows' argument to the callback
    // using .row() we've given a callback to d3.csv that tells how to change every row that it reads,
    //feeding each row into the function as araw object and whatever the function returns goes into the final result
    d3.csv(this.props.url)
      .row((d) => {
        if (!d['base salary']) {
          return null;
        }
        return {
          employer: d.employer,
          submit_date: dateFormat.parse(d['submit date']),
          start_date: dateFormat.parse(d['start date']),
          case_status: d['case status'],
          job_title: d['job title'],
          clean_job_title: this.cleanJobs(d['job title']),
          base_salary: Number(d['base salary']),
          salary_to: d['salary to'] ? Number(d['salary to']) : null,
          city: d.city,
          state: d.state
        };
      })//end d3.row
      .get((error, rows) => {
        if (error) {
          console.error(error);
          console.error(error.stack);
        } else {
          this.setState({ rawData: rows });
        }
      })
      console.log("ATTN: data locked and loaded")
  }

  render() {
    //add a loading data message
    //render methid returns different elements based on whether or not there is data.
    //by accessing this.sate.rawData and relying on the re-rendered triggered by this.state
    //to get rid of the loading notice when data is present
    if (!this.state.rawData.length) {
      return (
        <h2>Loading data about 81,000 H1B visas in the software industry...</h2>
      );
    }

    //SET parameters for SVG and histogram component
    let params = {
      bins: 20,
      width: 500,
      height: 500,
      axisMargin: 83,
      topMargin: 10,
      bottomMargin: 5,
      value: (d) => d.base_salary
    },
      fullWidth = 700;

    //if data does exist, draw the graph!
    return (
      <div>
        <svg width={fullWidth} height={params.height}>
          <Histogram {...params} data={this.state.rawData} />
        </svg>
      </div>
    );
  }
}

export default H1BGraph;
