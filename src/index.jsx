require ('./styles/style.less')
import React from 'react';
import ReactDOM from 'react-dom';
import H1BGraph from './components/H1BGraph/H1BGraph.jsx';

String.prototype.capitalize = () => {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.decapitalize = () => {
  return this.charAt(0).toLowerCase() + this.slice(1);
};

ReactDOM.render(
  <H1BGraph url="data/h1bs.csv" />,
  document.querySelectorAll('.h1bgraph')[0]
);
