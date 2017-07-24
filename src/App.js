import React, { Component } from "react";
import { Navbar, Button } from "react-bootstrap";
import Poodr from "./Poodr/Poodr";
import "./App.css";
import AddToSlack from "./AddToSlack/AddToSlack";
import { AUTH } from "./tokens";
import history from "./history";

class App extends Component {
  login(code) {
    const url = `https://slack.com/api/oauth.access?client_id=${AUTH.clientId}&client_secret=${AUTH.clientSecret}&code=${code}&redirect_uri=http://localhost:3000/callback&pretty=1`;
    fetch(url).then(resp => resp.json()).then(data => {
      if (data.ok) {
        const bot = data.bot;
        const user = {
          access_token: data.access_token,
          user_id: data.user_id
        };
        this.setState({ bot: bot, user: user });
        this.setState({ authed: true });
      } else {
        this.setState({ authed: false });
      }
    });
  }

  constructor() {
    super();
    this.state = {};
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
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand id="navbar-brand">
              <a href="#">Poodr</a>
              <p />
            </Navbar.Brand>
            {!this.state.authed && <AddToSlack />}
          </Navbar.Header>
        </Navbar>
        {this.state.authed && <Poodr user={this.state.user} bot={this.state.bot} />}
      </div>
    );
  }
}

export default App;

const getCode = queryString => {
  const firstParam = queryString.split("&")[0];
  const code = firstParam.split("=")[1];
  return code;
};
