import React, { Component } from "react";
import Member from "./Member/Member";

export default class Groups extends Component {
  render() {
    return (
      <div className="groups">
        {this.props.groups && this.props.groups.map((group, i) => {
          const groupWidth = group.length < 5 ? 226 : 334;
          return (
            <div
              className="group"
              style={{ maxWidth: groupWidth }}
              key={i}
              data-group_id={i}
              onDrop={this.props.dropHandler}
              onDragEnter={this.dragEnterHandler}
              onDragOver={this.dragOverHandler}
              onDragLeave={this.dragLeaveHandler}
              onDragExit={this.dragExitHandler}
            >
              {group.map((member, memberIndex) => {
                if (typeof member === "object") {
                  return (
                    <Member
                      dragStartHandler={this.props.dragStartHandler}
                      token={this.props.token}
                      u_id={member.id}
                      userName={member.name}
                      image={member.img}
                      enabled={member.enabled}
                      groupIndex={i}
                      memberIndex={memberIndex}
                      key={member.id}
                      clickHandler={this.props.memberClickHandler}
                    />
                  );
                } else {
                  return null;
                }
              })}
            </div>
          );
        })}
      </div>
    );
  }

  dragEnterHandler(event) {
    event.preventDefault();
  }

  dragOverHandler(event) {
    event.preventDefault();
  }

  dragLeaveHandler(event) {
    event.preventDefault();
  }

  dragExitHandler(event) {
    event.preventDefault();
  }
}
