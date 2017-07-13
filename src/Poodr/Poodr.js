import React, { Component } from 'react';
import Options from './Options/Options';
import UserInfo from './UserInfo/UserInfo';

export default class Poodr extends Component {
  render() {
    return (
      <div id="user-is-logged-in">
        <UserInfo {...this.props} />
        <Options {...this.props} />
      </div>
    );
  }
}
