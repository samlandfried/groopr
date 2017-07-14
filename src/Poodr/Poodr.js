import React, { Component } from 'react';
import Options from './Options/Options';
import UserInfo from './UserInfo/UserInfo';

export default class Poodr extends Component {
  /*constructor() {
    super();
    this.state = {
      loggedIn: false
    };
  }

  async componentWillMount() {
    const user = await SlackUser.login;
    this.setState({
      loggedIn: true,
      token: user.token
    });
  }*/

  render() {
    return (
      <div id="user-is-logged-in">
        {this.props.auth.getManagementToken()}
        <UserInfo {...this.props} />
        <Options {...this.props} />
      </div>
    );
  }
}
