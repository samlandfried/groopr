import React, { Component } from 'react';

export default class UserInfo extends Component {
  render() {
    return (
      <div id="logged-in-user">
        <img src={this.props.user.image_512} />
        <h2> Welcome, {this.props.user.name}! </h2>
      </div>
    );
  }
}
