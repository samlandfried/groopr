import React, { Component } from "react";

export default class Groups extends Component {
  render() {
    return (
      <ul>
        {this.props.groups.map(group => {
          return (
            <li>
              <ol>
                {group.map(member => <li>{member}</li>)}
              </ol>
            </li>
          );
        })}
      </ul>
    );
  }
}
