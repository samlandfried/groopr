import React, { Component } from "react";
import Poodr from "./Poodr/Poodr";
import UserInfo from "./UserInfo/UserInfo";
import "./App.css";
import AddToSlack from "./AddToSlack/AddToSlack";
import history from "./history";

class App extends Component {
  constructor() {
    super();
    this.state = { groups: [] };
  }

  componentDidMount() {
    if (localStorage.code) {
      this.login(localStorage.code);
      localStorage.removeItem("code");
    }
    if (localStorage.authed) {
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
          {!localStorage.authed && <AddToSlack />}
          {localStorage.authed &&
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
          {localStorage.authed &&
            <Poodr
              user={this.state.user}
              botToken={localStorage.bot_token}
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
    const url = `https://slack.com/api/users.info?token=${localStorage.bot_token}&user=${localStorage.user_id}&pretty=1`;

    fetch(url).then(resp => resp.json()).then(data => {
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
    fetch(url).then(resp => resp.json()).then(data => {
      if (data.ok) {
        localStorage.setItem("authed", true);
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("bot_token", data.bot.bot_access_token);
          history.replace('/')
      } else {
        this.logOut();
        console.error(new Error(data));
      }
    });
  }

  logOut(event) {
    event && event.preventDefault();
    console.log('Logged out!')
    localStorage.removeItem("authed");
    localStorage.removeItem("bot-token");
    localStorage.removeItem("user-token");
    localStorage.removeItem("user-id");
    history.replace('/');
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
    channels = nodeListMap(channels, channel => channel.value);
    usergroups = nodeListMap(usergroups, usergroup => usergroup.value);

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
    const token = localStorage.bot_token;
    const channels = options.channels.map(channel => {
      const url =
        "https://slack.com/api/channels.info?token=" +
        token +
        "&channel=" +
        channel;

      return fetch(url)
        .then(json)
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
        .then(json)
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

      const uniqueUserIds = unique(userIds);
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
      .then(json)
      .then(data => {
        this.setState({
          groups: data.groups
        });
      })
      .catch(error => console.error(error));
  }
}

export default App;

const getCode = queryString => {
  const firstParam = queryString.split("&")[0];
  const code = firstParam.split("=")[1];
  return code;
};

const json = response => response.json();
const status = response => {
  if (response.ok) {
    Promise.resolve(response);
  } else {
    Promise.reject(response);
  }
};

const nodeListMap = (nodeList, cn) => {
  const newArray = [];
  for (let i = 0; i < nodeList.length; i++) {
    newArray.push(cn(nodeList[i]));
  }
  return newArray;
};

const unique = collection => {
  return collection.reduce((result, ele) => {
    if (!result.includes(ele)) {
      result.push(ele);
    }
    return result;
  }, []);
};
