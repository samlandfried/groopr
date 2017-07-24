import React, { Component } from "react";
import { AUTH_CONFIG } from "../Auth/auth0-variables";

export default class AddToSlack extends Component {
  render() {
    return (
      <a href="https://slack.com/oauth/authorize?scope=bot&client_id=146403140194.210920080358&redirect_uri=http://localhost:3000/callback">
        <img
          alt="Add to Slack"
          height="40"
          width="139"
          src="https://platform.slack-edge.com/img/add_to_slack.png"
          srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        />
      </a>
    );
  }
}
