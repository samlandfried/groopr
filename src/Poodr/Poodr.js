import React, { Component } from "react";
import Options from "./Options/Options";
import UserInfo from "./UserInfo/UserInfo";
import Groups from "./Groups/Groups";
import Notify from "./Notify/Notify";

export default class Poodr extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      groups: [],
      channelName: null
    };
  }

  makeGroups(channel_id) {
    const form = document.querySelector("#grouping-options");
    const groupingStrategy = form.querySelector("#grouping-strategy-select")
      .value;
    const groupSize = form.querySelector("#group-size-select").value;
    const oddMemberStrategy = document.querySelector(
      'input[name="odd-member-strategy"]:checked'
    ).value;
    const options = {
      size: groupSize,
      oddMemberStrategy: oddMemberStrategy,
      groupingStrategy: groupingStrategy
    };

    const token = this.state.user.identities[0].access_token;
    const url =
      "https://slack.com/api/channels.info?token=" +
      token +
      "&channel=" +
      channel_id;
    fetch(url)
      .then(
        function(resp) {
          return resp.json();
        }.bind(this)
      )
      .then(
        function(data) {
          const members = data.channel.members;
          this.setState({ channelName: data.channel.name });
          const grooprUrl = "http://groopr.herokuapp.com/api/v1/groups";

          const body = {
            method: "POST",
            headers: new Headers({ "Content-Type": "application/json" }),
            body: JSON.stringify({ collection: members, options: options })
          };

          fetch(grooprUrl, body)
            .then(
              function(resp) {
                return resp.json();
              }.bind(this)
            )
            .then(data => {
              this.setState({
                groups: data.groups
              });
            })
            .catch(error => console.error(error));
        }.bind(this)
      );
  }

  messagePeeps() {
    const message = document.querySelector('form textarea').value;
    const skipHistory = document.querySelector('form input[type="checkbox"]').checked;
    const token = this.state.user.identities[0].access_token;
    const groups = this.state.groups;
    debugger
  }


  render() {
    return (
      // Options
      // Notify
      // Groups
      <div id="user-is-logged-in">
        {" "}{Object.keys(this.state.user).length > 0 &&
          <div id="user-info-loaded">
            <UserInfo user={this.state.user} />{" "}
            {this.state.groups.length === 0 &&
              <Options
                token={this.state.user.identities[0].access_token}
                makeGroups={this.makeGroups.bind(this)}
              />}{" "}
            {this.state.groups.length > 0 &&
              <div className="groups">
                <Notify
                  user={this.state.user.name}
                  channel={this.state.channelName}
                  messagePeeps={this.messagePeeps.bind(this)}
                />{" "}
                <Groups groups={this.state.groups} />{" "}
              </div>}{" "}
          </div>}{" "}
      </div>
    );
  }
}
