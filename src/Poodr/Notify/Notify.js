import React, { Component } from "react";

export default class Notify extends Component {
  render() {
    return <p>
      Assigned by: {this.props.user} <br/>
      Channel name: {this.props.channel}
    </p>;
  }
}
