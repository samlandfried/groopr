import React, { Component } from "react";

export default class Notify extends Component {
  constructor() {
    super();
    this.state = {
      channels: [],
      usergroups: []
    };
  }

  render() {
    return <p>
      strategy: {this.props.groupingStrategy} <br />
      size: {this.props.groupSize} <br />
      oddMember: {this.props.oddMemberStrategy} <br />
      channel: {this.props.channel_id}
    </p>;
  }
}
