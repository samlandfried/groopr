import React, { Component } from "react";
import Member from "./Member/Member";
import { Row, Col, Card, CardPanel } from "react-materialize";

export default class Groups extends Component {
  render() {
    return (
      <Row m={6} s={12}>
          <div className="groups">
            {this.props.groups &&
              this.props.groups.map(group => {
                const groupWidth = group.members.length < 5 ? 226 : 334;
                return (
                  <CardPanel
                    className="white group"
                    key={group.id}
                    data-group_id={group.id}
                    onDrop={this.props.dropHandler}
                    onDragEnter={this.dragEnterHandler}
                    onDragOver={this.dragOverHandler}
                    onDragLeave={this.dragLeaveHandler}
                    onDragExit={this.dragExitHandler}
                  >
                    {group.members.map((member, memberIndex) => {
                      if (typeof member === "object") {
                        return (
                          <Member
                            dragStartHandler={this.props.dragStartHandler}
                            token={this.props.token}
                            u_id={member.id}
                            userName={member.name}
                            image={member.img}
                            enabled={member.enabled}
                            groupIndex={group.id}
                            memberIndex={memberIndex}
                            key={member.id}
                            clickHandler={this.props.memberClickHandler}
                          />
                        );
                      } else {
                        return null;
                      }
                    })}
                  </CardPanel>
                );
              })}
          </div>
      </Row>
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
