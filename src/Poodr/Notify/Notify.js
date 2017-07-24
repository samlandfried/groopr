import React, { Component } from "react";

export default class Notify extends Component {
  render() {
    const defaultMessage = `You have been assigned to this group from ${this.props .channel} by ${this.props.user}`;
    return (
      <form id="notify-groups" >
        <h2>Message to send to groups:</h2>
        <textarea autofocus value={defaultMessage} cols="50" rows="4"  />
        <div>
          <h3>Skip history?</h3>
          <input type="checkbox" id="skip-history" value="skipHistory" />
          <label>Don't record these groups.</label>
        </div>
        <input type="submit" value="Notify Groups" onClick={this.props.messagePeeps}/>
      </form>
    );
  }
}
