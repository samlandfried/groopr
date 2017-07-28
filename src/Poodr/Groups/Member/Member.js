import React, { Component } from "react";

export default class Member extends Component {
  render() {
    return (
      <div data-enabled={this.props.enabled} onClick={this.props.clickHandler} draggable={this.props.enabled} onDragStart={this.props.dragStartHandler} className="member" data-u_id={this.props.u_id} data-groupIndex={this.props.groupIndex} data-memberIndex={this.props.memberIndex}>
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
