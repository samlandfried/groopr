import React, { Component } from 'react';

export default class UserInfo extends Component {
  render() {
    return (
      <div id="logged-in-user">
        <p>
          access_token:  {this.props.user.keys} <br />
          id_token: {localStorage.id_token} <br />
          expires_at: {localStorage.expires_at} <br />
        </p>
      </div>
    );
  }
}
