import React, { Component } from "react";

export default class Notify extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return <p>
      Assigned by: {this.props.user}
    </p>;
  }
}
