import React, { Component } from "react";
import { Button } from "react-materialize";

export default class UserInfo extends Component {
  render() {
    return (
      <Button className="logout" onClick={this.props.logout}>
        <img src={this.props.user.image} />
        Logout
      </Button>
    );
  }
}
