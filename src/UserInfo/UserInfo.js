import React, { Component } from "react";

export default class UserInfo extends Component {
  render() {
    return (
      <div id="logged-in-user">
        <h4>
          Welcome, {this.props.user.name}!
          <img src={this.props.user.image} />
        </h4>
      </div>
    );
  }
}
