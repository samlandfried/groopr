import React, { Component } from "react";
import { Button, Row, Input, CardPanel } from "react-materialize";

export default class Notify extends Component {
  render() {
    const defaultMessage = `You have been assigned to this group by ${this.props
      .user}`;
    return (
      <Row className="notify">
        <CardPanel>
          <Button onClick={this.props.clearGroups}>
            Go Back
          </Button>
          <Button onClick={this.props.messagePeeps}>Notify Groups</Button>
          <form id="notify-groups">
            <h3 className="options-label">Message:</h3>
            <textarea defaultValue={defaultMessage} cols="30" />
            <h3 className="options-label">Skip history?</h3>
            <Row>
            <Input name="skip-history" type="checkbox" value="skip-history" label="Do not record these groups" />
            </Row>
          </form>
        </CardPanel>
      </Row>
    );
  }
}
