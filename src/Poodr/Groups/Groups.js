import React, { Component } from "react";
import Member from "./Member/Member";

export default class Groups extends Component {
  render() {
    let g_id = 0;
    return (
      <div className="groups">
        { this.props.groups.map(group => {
          g_id ++;
          const groupWidth = group.length < 5 ? 226 : 334
          return (
            <div className="group" style={{maxWidth: groupWidth}} key={g_id} data-group-id={g_id}>
              {group.map(member => <Member token={this.props.token} u_id={member} key={member} />)}
            </div>
          );
        })}
      </div>
    );
  }
}
