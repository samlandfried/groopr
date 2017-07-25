import React, { Component } from "react";

export default class Member extends Component {
  render() {
    return (
      <div className="groups">
      <p>
        {this.props.user }
        </p>
      </div>
    );
  }
}
