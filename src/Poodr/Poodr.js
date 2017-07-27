import React, { Component } from "react";
import Options from "./Options/Options";
import Groups from "./Groups/Groups";
import Notify from "./Notify/Notify";
import history from "./../history";

export default class Poodr extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      groups: [],
      channelName: null
    };
  }

  render() {
    return (
      <div id={"poodr"}>
        {" "}{this.state.groups.length === 0 &&
          <div className={"options"}>
            <Options
              token={this.props.bot.bot_access_token}
              makeGroups={this.makeGroups.bind(this)}
            />{" "}
          </div>}{" "}
        {this.state.groups.length > 0 &&
          <div className="notify-and-groups">
            <Notify
              user={this.props.user.name}
              channel={this.state.channelName}
              messagePeeps={this.messagePeeps.bind(this)}
              clearGroups={this.clearGroups.bind(this)}
            />{" "}
            {" "}
            <Groups
              token={this.props.bot.bot_access_token}
              groups={this.state.groups}
              dragStartHandler={this.dragStartHandler.bind(this)}
              dropHandler={this.dropHandler.bind(this)}
              memberClickHandler={this.memberClickHandler.bind(this)}
            />{" "}
            {" "}
          </div>}{" "}
        {" "}
      </div>
    );
  }

  memberClickHandler(event) {
    const member = event.currentTarget;

    if (member.dataset.enabled === "true") {
      this.disable(member);
    } else {
      this.enable(member);
      member.setAttribute("data-enabled", "true");
      for (let i = 0; i < member.children.length; i++) {
        member.children[i].setAttribute("draggable", "false");
      }
      member.setAttribute("draggable", "true");
      member.style.backgroundColor = "salmon";
    }
  }

  dragStartHandler(event) {
    const img = event.currentTarget.querySelector("img");
    const dataToSend = {
      u_id: event.currentTarget.dataset.u_id,
      fromGroup: event.currentTarget.dataset.group_id
    };
    event.dataTransfer.setDragImage(img, 45, 45);
    event.dataTransfer.dropEffect = "move";
    event.dataTransfer.setData("text", JSON.stringify(dataToSend));
  }

  dropHandler(event) {
    event.preventDefault();
    const toGroup = event.currentTarget.dataset.group_id;
    const data = event.dataTransfer.getData("text");
    const dropped = JSON.parse(data);
    const groups = this.state.groups;
    this.removeUserFromGroup(dropped.u_id, groups[dropped.fromGroup]);
    groups[toGroup].push(dropped.u_id);
    this.setState({ groups: groups });
  }

  clearGroups() {
    this.setState({ groups: [] });
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

    const token = this.props.bot.bot_access_token;
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
          const grooprUrl = "https://groopr.herokuapp.com/api/v1/groups";

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

  messagePeeps(event) {
    event.preventDefault();
    const message = document.querySelector("form textarea").value;
    const skipHistory = document.querySelector('form input[type="checkbox"]')
      .checked;
    const token = this.props.bot.bot_access_token;
    const groups = this.state.groups;

    // When it's just one user, this needs to be a DM w/ the bot. Different endpoint for DMs
    const url = `https://slack.com/api/mpim.open?token=${token}&users=`;
    groups.forEach(group => {
      const users = group.join(",");

      fetch(url + users).then(resp => resp.json()).then(data => {
        if (data.ok) {
          const g_id = data.group.id;
          const dmUrl = `https://slack.com/api/chat.postMessage?token=${token}&channel=${g_id}&text=${message}&pretty=1`;
          fetch(dmUrl).then(resp => resp.json()).then(data => {
            if (data.ok) {
              this.clearGroups();
            } else {
              console.error(data.error);
            }
          });
        } else {
          console.error(data.error);
        }
      });
    });
    this.sendConfirmation(groups);
  }

  sendConfirmation(groups) {
    const msg = this.buildMessage(groups);
    let url = `https://slack.com/api/im.open?token=${this.props.bot
      .bot_access_token}&user=${this.props.user.u_id}&pretty=1`;
    fetch(url).then(resp => resp.json()).then(data => {
      if (data.ok) {
        const c_id = data.channel.id;
        url = `https://slack.com/api/chat.postMessage?token=${this.props.bot
          .bot_access_token}&channel=${c_id}&text=${msg}&pretty=1`;
        console.log(url);
        fetch(url).then(resp => resp.json()).then(data => {
          console.log(data);
          if (!data.ok) {
            console.error(data.error);
          }
        });
      } else {
        console.error(data.error);
      }
    });
  }

  buildMessage() {
    const groups = document.querySelectorAll(".group");
    let msg = "@@@@@@@@@@\n";
    msg += "@@@@ Groups @@@@\n";
    msg += "@@@@@@@@@@\n";
    let group, member;

    for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
      msg += "\n#############";
      msg += "\nGroup # " + (groupIndex + 1);
      group = groups[groupIndex].querySelectorAll(".member");
      for (let memberIndex = 0; memberIndex < group.length; memberIndex++) {
        member = group[memberIndex];
        msg += "\n" + member.querySelector("h6").innerText;
      }
      msg += "\n";
    }

    return encodeURIComponent(msg);
  }

  removeUserFromGroup(user, group) {
    const i = group.indexOf(user);
    return group.splice(i, 1);
  }

  disable(member) {
    const data = member.dataset;
    const groupIndex = data.group_id;
    const memberId = data.u_id;

    member.setAttribute("data-enabled", "false");
    member.setAttribute("draggable", "false");
    member.style.backgroundColor = "red";

    this.changeDescendantsAttributes(member, "draggable", "false");
    this.removeMemberFrom(memberId, groupIndex);
  }

  enable(member) {
    const data = member.dataset;
    const groupIndex = data.group_id;
    const memberId = data.u_id;

    member.setAttribute("data-enabled", "false");
    member.setAttribute("draggable", "false");
    member.style.backgroundColor = "red";

    this.changeDescendantsAttributes(member, "draggable", "false");
    this.addMemberTo(memberId, groupIndex);
  }

  removeMemberFrom(memberId, groupIndex) {
    const group = this.state.groups[groupIndex];
    const i = group.indexOf(memberId);
    group.splice(i, 1);
  }

  addMemberTo(memberId, groupIndex) {
    const group = this.state.groups[groupIndex];
    group.push(memberId);
  }

  changeDescendantsAttributes(member, attr, val) {
    for (let i = 0; i < member.children.length; i++) {
      member.children[i].setAttribute(attr, val);
      this.changeDescendantsAttributes(member.children[i], attr, val);
    }
  }
}
