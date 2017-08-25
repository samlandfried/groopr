import React, { Component } from "react";

export default class Member extends Component {
  render() {
    return (
      <div
        data-enabled={this.props.enabled}
        onClick={this.props.clickHandler}
        draggable={this.props.enabled}
        onDragStart={this.props.dragStartHandler}
        className={
          "card member " + (this.props.enabled ? "enabled" : "disabled")
        }
        data-u_id={this.props.u_id}
        data-groupIndex={this.props.groupIndex}
        data-memberIndex={this.props.memberIndex}
      >
        <h6 draggable={this.props.enabled}>
          {this.props.userName}
        </h6>
        <img src={this.props.image} draggable={this.props.enabled} />
      </div>
    );
  }
}
