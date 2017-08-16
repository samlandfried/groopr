import React, { Component } from "react";
import { Button, Navbar, NavItem } from "react-materialize";
import Poodr from "./Poodr/Poodr";
import UserInfo from "./UserInfo/UserInfo";
import Landing from "./Landing/Landing";
import $ from "jquery";
import history from "./history";
import _ from "./funcs";

export default class App extends Component {
  constructor() {
    super();
    this.state = { groups: [] };
  }

  componentDidMount() {
    if (localStorage.code) {
      this.login(localStorage.code);
      localStorage.removeItem("code");
    }
    if (_.cookies().authed) {
      this.fetchUserInfo();
    }
  }

  render() {
    return (
      <div id="App">
        <nav>
          <div className="nav-wrapper">
            <div className="logo">
              <img src={require("./img/groopr-logo.png")} alt="Groopr logo" />
              <h1>Groopr</h1>
            </div>
            {_.cookies().authed &&
              this.state.user &&
              <UserInfo user={this.state.user} logout={this.logOut} />}
          </div>
        </nav>
        <section className="main">
          {" "}{!_.cookies().authed && <Landing />}
          {_.cookies().authed &&
            <Poodr
              user={this.state.user}
              botToken={_.cookies().bot_token}
              userToken={_.cookies().user_token}
              groups={this.state.groups}
              makeGroups={this.makeGroups.bind(this)}
              groupsChanger={this.groupsChanger.bind(this)}
              clearGroups={this.clearGroups.bind(this)}
            />
          }{" "}
        </section>{" "}
      </div>
    );
  }

  groupsChanger(groups) {
    this.setState({ groups: groups });
  }

  clearGroups() {
    this.setState({ groups: [] });
  }

  fetchUserInfo() {
    const url = `https://slack.com/api/users.info?token=${_.cookies()
      .bot_token}&user=${_.cookies().user_id}&pretty=1`;

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

  login(code) {
    const url = `https://slack.com/api/oauth.access?client_id=${process.env
      .REACT_APP_SLACK_CLIENT_ID}&client_secret=${process.env
      .REACT_APP_SLACK_SECRET}&code=${code}&redirect_uri=${process.env
      .REACT_APP_SLACK_CALLBACK}&pretty=1`;
    fetch(url).then(_.json).then(data => {
      if (data.ok) {
        _.createCookie("authed", "true", 30);
        _.createCookie("user_id", data.user_id, 30);
        _.createCookie("user_token", data.access_token, 30);
        _.createCookie("bot_token", data.bot.bot_access_token, 30);
        _.createCookie("team_id", data.team_id, 30);
        history.replace("/");
      } else {
        this.logOut();
        console.error(new Error(data));
      }
    });
  }

  logOut(event) {
    event && event.preventDefault();
    _.deleteCookie("authed");
    _.deleteCookie("bot_token");
    _.deleteCookie("user_token");
    _.deleteCookie("user_id");
    _.deleteCookie("team_id");

    history.replace("/");
  }

  getFormVals() {
    const form = document.querySelector("#grouping-options");
    const groupingStrategy = form.querySelector("#grouping-strategy-select")
      .value;
    const groupSize = form.querySelector("#group-size-select").value;
    const oddMemberStrategy = document.querySelector(
      'input[name="odd-member-strategy"]:checked'
    ).value;
    let channels = document.querySelectorAll('input[name="channel"]:checked');
    let usergroups = document.querySelectorAll(
      'input[name="usergroup"]:checked'
    );
    channels = _.nodeListMap(channels, channel => channel.value);
    usergroups = _.nodeListMap(usergroups, usergroup => usergroup.value);

    return {
      size: groupSize,
      channels: channels,
      usergroups: usergroups,
      oddMemberStrategy: oddMemberStrategy,
      groupingStrategy: groupingStrategy
    };
  }

  makeGroups(event) {
    event.preventDefault();
    const options = this.getFormVals();
    const token = _.cookies().user_token;

    const channels = options.channels.map(channel => {
      const url =
        "https://slack.com/api/channels.info?token=" +
        token +
        "&channel=" +
        channel;

      return fetch(url)
        .then(_.json)
        .then(data => data)
        .catch(error => new Error(error));
    });

    const usergroups = options.usergroups.map(usergroup => {
      const url =
        "https://slack.com/api/usergroups.users.list?token=" +
        token +
        "&usergroup=" +
        usergroup;

      return fetch(url)
        .then(_.json)
        .then(data => data)
        .catch(error => new Error(error));
    });

    const promises = channels.concat(usergroups);
    Promise.all(promises).then(channelGroups => {
      const userIds = channelGroups.reduce((users, channelGroup) => {
        if (channelGroup.ok) {
          if (channelGroup.channel) {
            users = users.concat(channelGroup.channel.members);
          } else {
            users = users.concat(channelGroup.users);
          }
        } else {
          users.push(new Error(channelGroup));
        }
        return users;
      }, []);

      const uniqueUserIds = _.unique(userIds);
      this.callGroopr(uniqueUserIds, options);
    });
  }

  callGroopr(members, options) {
    const grooprUrl = process.env.REACT_APP_GROOPR_PATH + "/api/v1/groups";

    const body = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        collection: members,
        options: options,
        client: _.cookies().team_id
      })
    };

    fetch(grooprUrl, body)
      .then(_.json)
      .then(data => {
        this.setState({
          groups: data
        });
      })
      .catch(error => console.error(error));
  }
}
