import React, { Component } from "react";

export default class Groups extends Component {
  constructor() {
    super();
    this.state = {
      channels: [],
      usergroups: []
    };
  }

  render() {
    return <p>
      Groups, son!
    </p>;
  }
}
