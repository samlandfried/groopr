import React, { Component } from "react";
import Poodr from "./Poodr/Poodr";
import UserInfo from "./UserInfo/UserInfo";
import "./App.css";
import AddToSlack from "./AddToSlack/AddToSlack";
import history from "./history";

class App extends Component {
  constructor() {
    super();
    // this.state = {groups: []};

    const user = {
      access_token: process.env.REACT_APP_USER_TOKEN,
      user_id: "U4ABV446N"
    };
    this.fetchUserInfo(user);
    this.state = {
      bot: {
        bot_user_id: "U6CJ3H9MG",
        bot_access_token: process.env.REACT_APP_BOT_TOKEN
      },
      groups: [],
      authed: true
    };
  }

  componentDidMount() {
    if (localStorage.code) {
      this.login(localStorage.code);
      localStorage.removeItem("code");
    }
  }

  render() {
    return (
      <div id="App">
        <section className="navbar">
          <div className="brand button" id="navbar-brand">
            <a href="https://github.com/samlandfried/poodr-react">
              Poodr on GitHub
            </a>
          </div>
          {!this.state.authed && <AddToSlack />}
          {this.state.authed &&
            this.state.user &&
            <UserInfo user={this.state.user} />}
        </section>
        <section className="main">
          {this.state.authed &&
            <Poodr
              user={this.state.user}
              bot={this.state.bot}
              groups={this.state.groups}
              makeGroups={this.makeGroups.bind(this)}
              groupsChanger={this.groupsChanger.bind(this)}
            />}
        </section>
      </div>
    );
  }

  groupsChanger(groups) {
    this.setState({ groups: groups });
  }

  fetchUserInfo(user) {
    const token = user.access_token;
    const u_id = user.user_id;
    console.log(token);
    console.log(u_id);

    const url = `https://slack.com/api/users.info?token=${token}&user=${u_id}&pretty=1`;
    fetch(url).then(resp => resp.json()).then(data => {
      if (data.ok) {
        const user = data.user.profile;
        this.setState({
          user: {
            access_token: token,
            u_id: u_id,
            name: user.real_name,
            image: user.image_48
          }
        });
      } else {
        console.error(data);
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
        const bot = data.bot;
        const user = {
          access_token: data.access_token,
          user_id: data.user_id
        };
        this.fetchUserInfo(user);
        this.setState({ bot: bot });
        this.setState({ authed: true });
      } else {
        this.setState({ authed: false });
      }
    });
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

    const token = this.state.bot.bot_access_token;
    const url =
      "https://slack.com/api/channels.info?token=" +
      token +
      "&channel=" +
      channel_id;

    const self = this;
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
            .then(
              function(data) {
                this.setState({
                  groups: data.groups
                });
              }.bind(self)
            )
            .catch(error => console.error(error));
        }.bind(this)
      );
  }
}

export default App;

const getCode = queryString => {
  const firstParam = queryString.split("&")[0];
  const code = firstParam.split("=")[1];
  return code;
};
