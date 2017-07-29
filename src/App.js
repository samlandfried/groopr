import React, { Component } from "react";
import Poodr from "./Poodr/Poodr";
import UserInfo from "./UserInfo/UserInfo";
import "./App.css";
import AddToSlack from "./AddToSlack/AddToSlack";
import history from "./history";
import _ from "./funcs"

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
        <section className="navbar">
          <a href="https://github.com/samlandfried/poodr-react">
            <div className="brand button" id="navbar-brand">
              Poodr on GitHub
            </div>
          </a>
          {!_.cookies().authed && <AddToSlack />}
          {_.cookies().authed &&
            this.state.user &&
            <div className="user-authed">
              <UserInfo user={this.state.user} />
              <input
                type="submit"
                value="Logout"
                className="button"
                onClick={this.logOut}
              />
            </div>}
        </section>
        <section className="main">
          {_.cookies().authed &&
            <Poodr
              user={this.state.user}
              botToken={_.cookies().bot_token}
              groups={this.state.groups}
              makeGroups={this.makeGroups.bind(this)}
              groupsChanger={this.groupsChanger.bind(this)}
              clearGroups={this.clearGroups.bind(this)}
            />}
        </section>
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
        document.cookie = "authed=true";
        document.cookie = "user_id=" + data.user_id;
        document.cookie = "bot_token=" + data.bot.bot_access_token;
        console.log(_.cookies());
        debugger;
        history.replace("/");
      } else {
        this.logOut();
        console.error(new Error(data));
      }
    });
  }

  logOut(event) {
    event && event.preventDefault();
    document.cookie = "authed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "bot-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "user-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "user-id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
    const token = _.cookies().bot_token;
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
    const grooprUrl = "https://groopr.herokuapp.com/api/v1/groups";

    const body = {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ collection: members, options: options })
    };

    fetch(grooprUrl, body)
      .then(_.json)
      .then(data => {
        this.setState({
          groups: data.groups
        });
      })
      .catch(error => console.error(error));
  }
}
