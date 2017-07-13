import React, { Component } from 'react';

export default class Poodr extends Component {
  render() {
    return (
      <div id="grouping-strategy">
        <h2>Grouping Strategy</h2>
        <select id="grouping-strategy-select" >
          <option value="recommended">Recommended</option>
          <option value="random">Random</option>
        </select>
      </div>
    );
  }
}
