import React, { Component } from "react";
import Member from "./Member/Member";

export default class Groups extends Component {
  render() {
    return (
      <div className="groups">
        {this.props.groups.map(group => {
          let g_id = 1;
          return (
            <div className="group" id={g_id}>
              {group.map(member => <Member user={member} />)}
            </div>
          );
        })}
      </div>
    );
  }
}
