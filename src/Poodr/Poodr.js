import React, { Component } from "react";
import Options from "./Options/Options";
import Groups from "./Groups/Groups";
import Notify from "./Notify/Notify";
import history from "./../history";
import _ from './../funcs';

export default class Poodr extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div id={"poodr"}>
        {" "}{this.props.groups.length === 0 &&
          <div className={"options"} id="initial-options">
            <Options
              botToken={this.props.botToken}
              userToken={this.props.userToken}
              makeGroups={this.props.makeGroups}
            />{" "}
          </div>}{" "}
        {this.props.groups.length > 0 &&
          <div className="notify-and-groups">
            <Notify
              user={this.props.user.name}
              messagePeeps={this.messagePeeps.bind(this)}
              clearGroups={this.props.clearGroups}
            />{" "}
            {" "}
            <Groups
              token={this.props.botToken}
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
    if(!Array.isArray(this.props.groups)) {return}
    this.props.groups.forEach(group => {
      group.members.forEach(member => {
        if (!member.id) {
          this.fetchMember(member.name);
        }
      });
    });
  }

  fetchUserInfo() {
    const url = `https://slack.com/api/users.info?token=${_.cookies().user_token}&user=${_.cookies().user_id}&pretty=1`;

    fetch(url).then(_.json).then(data => {
      if (data.ok) {
        const user = data.user.profile;
        this.setState({
          user: {
            name: user.real_name,
            image: user.image_48
          }
        });
      } else {
        this.logOut();
        console.error(new Error(data));
      }
    });
  }


  fetchMember(u_id) {
    const url = `https://slack.com/api/users.info?token=${this.props.botToken}&user=${u_id}&pretty=1`;
    fetch(url)
      .then(_.json)
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
      const memberIndex = group.members.findIndex(member => member.name === u_id);
      if (memberIndex > -1) {
        groupsCopy[groupIndex].members[memberIndex] = user;
      }
    });

    this.setState({ groups: groupsCopy });
  }

  memberClickHandler(event) {
    const groups = this.props.groups;
    const data = event.currentTarget.dataset;
    const memberIndex = data.memberindex;
    const groupIndex = _.findGroupIndex(groups, data.groupindex);
    const member = groups[groupIndex].members[memberIndex];

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
    const groups = this.props.groups;
    const toGroup = _.findGroupIndex(groups, event.currentTarget.dataset.group_id);
    const data = event.dataTransfer.getData("text");
    const dropped = JSON.parse(data);
    const index = _.findGroupIndex(groups, dropped.fromGroup);
    const member = this.pluckMemberFromGroup(dropped.u_id, groups[index]);

    groups[toGroup].members.push(member);
    this.props.groupsChanger(groups);
  }

  messagePeeps(event) {
    event.preventDefault();
    const message = document.querySelector("form textarea").value;
    const skipHistory = document.querySelector('form input[type="checkbox"]')
      .checked;
    const token = this.props.botToken;
    const groups = this.props.groups;

    // When it's just one user, this needs to be a DM w/ the bot. Different endpoint for DMs
    const url = `https://slack.com/api/mpim.open?token=${token}&users=`;
    groups.forEach(group => {
      const membersToMessage = group.members.reduce((group, member) => {
        if(member.enabled) {
          group.push(member.id);
        }
        return group;
      }, new Array);

      const users = membersToMessage.join(",");

      fetch(url + users).then(_.json).then(data => {
        if (data.ok) {
          const g_id = data.group.id;
          const dmUrl = `https://slack.com/api/chat.postMessage?token=${token}&channel=${g_id}&text=${message}&pretty=1`;
          fetch(dmUrl).then(_.json).then(data => {
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
    let url = `https://slack.com/api/im.open?token=${this.props.botToken}&user=${_.cookies().user_id}&pretty=1`;
    fetch(url).then(_.json).then(data => {
      if (data.ok) {
        const c_id = data.channel.id;
        url = `https://slack.com/api/chat.postMessage?token=${this.props.botToken}&channel=${c_id}&text=${msg}&pretty=1`;
        fetch(url).then(_.json).then(data => {
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
    const i = group.members.findIndex(member => {
      return member.id === u_id
    });
    return group.members.splice(i, 1)[0];
  }
}
