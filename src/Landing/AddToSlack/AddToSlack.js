import React, { Component } from "react";

export default class AddToSlack extends Component {
  render() {
    const url = `https://slack.com/oauth/authorize?scope=bot,commands&client_id=${process.env.REACT_APP_SLACK_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_SLACK_CALLBACK}&pretty=1`
    return (
    <a
      id="addToSlackBtn"
      href={url}
    >
      <img
        alt="Add to Slack"
        height="40"
        width="139"
        src="https://platform.slack-edge.com/img/add_to_slack.png"
        srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
      />
    </a>)
  }
}
