import React, { Component } from "react";

export default class UserInfo extends Component {
  componentDidMount() {
    if (!this.state.name || !this.state.user) {
      this.fetchUserInfo();
    }
  }

  constructor() {
    super();
    this.state = this.state || {};
  }

  render() {
    return (
      <div id="logged-in-user">
        <h4>
          {" "}Welcome, {this.state.name}!
          <img src={this.state.image} />
        </h4>
      </div>
    );
  }

  fetchUserInfo() {
    const token = this.props.user.access_token;
    const u_id = this.props.user.user_id;
    const url = `https://slack.com/api/users.info?token=${token}&user=${u_id}&pretty=1`;
    fetch(url).then(resp => resp.json()).then(data => {
      if (data.ok) {
        const user = data.user.profile;
        this.setState({ name: user.real_name, image: user.image_48 });
      } else {
        console.error(data);
      }
    });
  }
}
