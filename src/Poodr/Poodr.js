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
      channelName: null
    };
  }

  render() {
    return (
      <div id={"poodr"}>
        {" "}{this.props.groups.length === 0 &&
          <div className={"options"}>
            <Options
              token={this.props.bot.bot_access_token}
              makeGroups={this.props.makeGroups}
            />{" "}
          </div>}{" "}
        {this.props.groups.length > 0 &&
          <div className="notify-and-groups">
            <Notify
              user={this.props.user.name}
              channel={this.state.channelName}
              messagePeeps={this.messagePeeps.bind(this)}
              clearGroups={this.props.clearGroups}
            />{" "}
            {" "}
            <Groups
              token={this.props.bot.bot_access_token}
              groups={this.props.groups}
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

  componentDidUpdate() {
    this.props.groups.forEach(group => {
      group.forEach(member => {
        if (typeof member === "string") {
          this.fetchMember(member);
        }
      });
    });
  }

  fetchMember(u_id) {
    const url = `https://slack.com/api/users.info?token=${this.props.bot.bot_access_token}&user=${u_id}&pretty=1`;
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        const deets = data.user.profile;
        const id = data.user.id;
        const user = {
          enabled: true,
          id: id,
          name: deets.real_name,
          img: deets.image_192
        };

        this.mapGroup(user);
      })
      .catch(error => console.error(error));
  }

  mapGroup(user) {
    const u_id = user.id;
    const groupsCopy = this.props.groups;

    groupsCopy.forEach((group, groupIndex) => {
      const memberIndex = group.indexOf(u_id);
      if (memberIndex > -1) {
        groupsCopy[groupIndex][memberIndex] = user;
      }
    });

    this.setState({ groups: groupsCopy });
  }

  memberClickHandler(event) {
    const data = event.currentTarget.dataset;
    const groupIndex = data.groupindex;
    const memberIndex = data.memberindex;
    const groups = this.props.groups;
    const member = groups[groupIndex][memberIndex];

    member.enabled = !member.enabled
    this.props.groupsChanger(groups)
  }

  dragStartHandler(event) {
    const img = event.currentTarget.querySelector("img");
    const dataToSend = {
      u_id: event.currentTarget.dataset.u_id,
      fromGroup: event.currentTarget.dataset.groupindex
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
    const groups = this.props.groups;
    const member = this.pluckMemberFromGroup(dropped.u_id, groups[dropped.fromGroup]);
    groups[toGroup].push(member);
    this.props.groupsChanger(groups);
  }

  messagePeeps(event) {
    event.preventDefault();
    const message = document.querySelector("form textarea").value;
    const skipHistory = document.querySelector('form input[type="checkbox"]')
      .checked;
    const token = this.props.bot.bot_access_token;
    const groups = this.props.groups;

    // When it's just one user, this needs to be a DM w/ the bot. Different endpoint for DMs
    const url = `https://slack.com/api/mpim.open?token=${token}&users=`;
    groups.forEach(group => {
      const membersToMessage = group.reduce((group, member) => {
        if(member.enabled) {
          group.push(member.id);
        }
        return group;
      }, new Array);

      const users = membersToMessage.join(",");

      fetch(url + users).then(resp => resp.json()).then(data => {
        if (data.ok) {
          const g_id = data.group.id;
          const dmUrl = `https://slack.com/api/chat.postMessage?token=${token}&channel=${g_id}&text=${message}&pretty=1`;
          fetch(dmUrl).then(resp => resp.json()).then(data => {
            if (data.ok) {
              this.props.clearGroups();
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
    msg += "@@@ Groups @@@\n";
    msg += "@@@@@@@@@@\n";
    let group, member;

    for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
      msg += "\n\n#############";
      msg += "\nGroup # " + (groupIndex + 1);
      group = groups[groupIndex].querySelectorAll(".member");
      for (let memberIndex = 0; memberIndex < group.length; memberIndex++) {
        member = group[memberIndex];
        if(member.dataset.enabled === 'true') {
          msg += "\n - " + member.querySelector("h6").innerText;
        }
      }
      msg += "\n";
    }

    return encodeURIComponent(msg);
  }

  pluckMemberFromGroup(u_id, group) {
    const i = group.findIndex(member => {
      return member.id === u_id
    });
    return group.splice(i, 1)[0];
  }
}
