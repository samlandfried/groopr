import React, { Component } from "react";

export default class Member extends Component {
  constructor() {
    super();
    if (!this.state || !this.state.user) {
      this.state = {};
    }
  }

  render() {
    return (
      <div data-enabled="true" onClick={this.props.clickHandler} draggable="true" onDragStart={this.props.dragStartHandler} className="member" data-u_id={this.props.u_id} data-group_id={this.props.group_id}>
          <div className="member-info">
            <h6>
              {this.props.userName}
            </h6>
            <div className="member-img">
              <img src={this.props.image} />
            </div>
          </div>
      </div>
    );
  }
}
