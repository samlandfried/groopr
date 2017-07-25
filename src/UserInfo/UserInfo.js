import React, { Component } from "react";

export default class UserInfo extends Component {
  render() {
    return (
      <div className="user-info">
        <h4>
          Welcome, {this.props.user.name}!
        </h4>
        <img src={this.props.user.image} />
      </div>
    );
  }
}
