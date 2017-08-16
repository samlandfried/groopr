import React, { Component } from "react";
import { Row, Col, Input, Card, Button } from "react-materialize";
import $ from "jquery";

export default class Options extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <Col m={6} s={12}>
        <Card className="white">
          <form id="grouping-options">
            <Button id="make-groups" onClick={this.props.makeGroups}>
              Make Groups
            </Button>
            <Row className="group-strategy-and-size">
              <div className="strategy">
                <h3 className="options-label">Grouping Strategy</h3>
                <Input
                  id="grouping-strategy-select"
                  s={12}
                  type="select"
                  defaultValue="recommended"
                >
                  <option value="perfect" disabled>
                    Perfect
                  </option>
                  <option value="recommended">Recommended</option>
                  <option value="random">Random</option>
                </Input>
              </div>
              <div className="size">
                <h3 className="options-label">Group Size</h3>
                <Input
                  id="group-size-select"
                  s={12}
                  type="select"
                  defaultValue="2"
                >
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                </Input>
              </div>
            </Row>
            <Row>
              <h3 className="options-label">Odd Member Strategy</h3>
              <Input
                name="odd-member-strategy"
                type="radio"
                value="larger"
                label="Larger Groups"
                className="with-gap"
                checked
              />
              <Input
                name="odd-member-strategy"
                type="radio"
                value="smaller"
                label="Smaller Groups"
                className="with-gap"
              />
            </Row>
            <Row>
              <h3 className="options-label">Choose Channels and Usergroups</h3>
              <Input
                s={12}
                label="Filter channels and usergroups"
                id="channel-search-input"
                onChange={this.filterChannels}
              />
            </Row>
            <Row className="channels-and-groups">
              <table id="channels">
                <thead>
                  <tr>
                    <th>Channel Name</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.channels &&
                    this.state.channels.map((channel, i) => {
                      return (
                        <tr className="channel" key={channel.id}>
                          <td>
                            <Input
                              name="channel"
                              type="checkbox"
                              value={channel.id}
                              label={channel.name}
                              aria-setsize={this.state.channels.length}
                              aria-posinset={i + 1}
                              aria-labelledby={"check-label-" + (i + 1)}
                              aria-checked="false"
                              tabIndex="0"
                              role="checkbox"
                              onClick={this.toggleCheck}
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              <table id="usergroups">
                <thead>
                  <tr>
                    <th>Usergroup Name</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.usergroups &&
                    this.state.usergroups.map((usergroup, i) => {
                      return (
                        <tr className="usergroup" key={usergroup.id}>
                          <td>
                            <Input
                              name="usergroup"
                              type="checkbox"
                              value={usergroup.id}
                              label={usergroup.name}
                              aria-setsize={this.state.usergroups.length}
                              aria-posinset={i + 1}
                              aria-labelledby={"check-label-" + (i + 1)}
                              aria-checked="false"
                              tabIndex="0"
                              role="checkbox"
                              onClick={this.toggleCheck}
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </Row>
          </form>
        </Card>
      </Col>
    );
  }

  componentDidMount() {
    $(document).ready(() => {
      $("select").material_select();
    });

    const channelsUrl =
      "https://slack.com/api/channels.list?exclude_archived=true&exclude_members=true&token=" +
      this.props.botToken;
    const groupsUrl =
      "https://slack.com/api/usergroups.list?exclude_archived=true&exclude_members=true&token=" +
      this.props.userToken;

    fetch(channelsUrl)
      .then(resp => resp.json())
      .then(data => {
        this.setState({
          channels: data.channels
        });
      })
      .catch(error => console.error(error));

    fetch(groupsUrl)
      .then(resp => resp.json())
      .then(data => {
        this.setState({
          usergroups: data.usergroups
        });
      })
      .catch(error => console.error(error));
  }

  toggleCheck(event) {
    const input = event.currentTarget;
    const currentVal = input.getAttribute("aria-checked");
    const newVal = currentVal === "false" ? "true" : "false";
    input.setAttribute("aria-checked", newVal);
  }

  filterChannels(event) {
    const query = event.target.value;
    const trs = document.querySelectorAll("tr.channel,tr.usergroup");

    let name;
    for (let i = 0; i < trs.length; i++) {
      trs[i].style.display = "";
      name = trs[i].querySelector("label").innerText;

      if (!name.includes(query)) {
        trs[i].style.display = "none";
      }
    }
  }
}
