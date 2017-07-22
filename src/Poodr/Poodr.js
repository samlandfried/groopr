import React, { Component } from "react";
import Options from "./Options/Options";
import UserInfo from "./UserInfo/UserInfo";
import { AUTH_CONFIG } from "../Auth/auth0-variables";

export default class Poodr extends Component {
  constructor() {
    super();
    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    const body = JSON.stringify({
      client_id: AUTH_CONFIG.managementId,
      client_secret: AUTH_CONFIG.managementSecret,
      audience: "https://samlandfried.auth0.com/api/v2/",
      grant_type: "client_credentials"
    });
    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: body
    };

    fetch("https://samlandfried.auth0.com/oauth/token", options)
      .then(resp => resp.text())
      .then(data => {
        const parser = require("jwt-decode");
        const u_id = parser(localStorage.id_token)["sub"];
        const parsed = JSON.parse(data);

        const options = {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + parsed.access_token
          }
        };
        // get user profile by parsing the localStorage.id_token JWT
        return fetch(
          "https://samlandfried.auth0.com/api/v2/users/" + u_id,
          options
        );
      })
      .then(resp => resp.json())
      .then(data => {
        debugger
        this.setState({ user: data });
      });
  }

  render() {
    return (
      <div id="user-is-logged-in">
        <UserInfo user={this.state.user} /> <Options {...this.props} />  {" "}
      </div>
    );
  }
}
