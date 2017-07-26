import React, { Component } from "react";

export default class Member extends Component {
  constructor() {
    super();
    if (!this.state || !this.state.user) {
      this.state = {};
    }
  }

  componentDidMount() {
    this.fetchMember(this.props.u_id);
  }

  render() {
    return (
      <div draggable="true" onDragStart={this.props.dragStartHandler} className="member" data-u_id={this.props.u_id} data-group_id={this.props.group_id}>
        {this.state.user &&
          <div className="member-info">
            <h6>
              {this.state.user.name}
            </h6>
            <div className="member-img">
              <img src={this.state.user.img} />
            </div>
          </div>}
      </div>
    );
  }

  fetchMember(u_id) {
    const url = `https://slack.com/api/users.info?token=${this.props
      .token}&user=${u_id}&pretty=1`;
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        const user = data.user.profile;
        this.setState({
          user: {
            name: user.real_name,
            img: user.image_192
          }
        });
      })
      .catch(error => console.error(error));
  }
}
