import React, { Component } from "react";

export default class Notify extends Component {
  render() {
    const defaultMessage = `You have been assigned to this group from ${this
      .props.channel} by ${this.props.user}`;
    return (
      <div className="notify options">
        <a className="button warning" onClick={this.props.clearGroups}>
          Go Back
        </a>
        <form id="notify-groups">
          <h2>Message:</h2>
          <textarea autoFocus defaultValue={defaultMessage} cols="30" rows="4" />
          <div>
            <h3>Skip history?</h3>
            <input type="checkbox" id="skip-history" value="skipHistory" />
            <label>Don't record these groups.</label>
          </div>
          <input
            className="button"
            type="submit"
            value="Notify Groups"
            onClick={this.props.messagePeeps}
          />
        </form>
      </div>
    );
  }
}
