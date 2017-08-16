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
        <Card className="light-blue lighten-4">
          <form id="grouping-options">
            <Button id="make-groups" onClick={this.props.makeGroups}>
              Make Groups
            </Button>
            <Row>
              <Input
                s={12}
                type="select"
                label="Grouping Strategy"
                defaultValue="recommended"
              >
                <option value="perfect" disabled>
                  Perfect
                </option>
                <option value="recommended" selected>
                  Recommended
                </option>
                <option value="random">Random</option>
              </Input>
            </Row>
            <Row>
              <Input
                s={12}
                type="select"
                label="Group Size"
                defaultValue="2"
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
              </Input>
            </Row>
            <Row>
              <Input name="odd-member-strategy" type="radio" value="larger" label="Larger Groups" className="with-gap" checked/>
              <Input name="odd-member-strategy" type="radio" value="smaller" label="Smaller Groups" className="with-gap" />
            </Row>
            <div id="channel-search">
              <h2>Choose Channels and Usergroups</h2>
              <input
                type="text"
                id="channel-search-input"
                onChange={this.filterChannels}
              />
            </div>
            <div className="channels-and-groups">
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
                            <div className="field">
                              <label onClick={this.toggleCheck}>
                                <input
                                  aria-setsize={this.state.channels.length}
                                  aria-posinset={i + 1}
                                  aria-labelledby={"check-label-" + (i + 1)}
                                  aria-checked="false"
                                  tabIndex="0"
                                  role="checkbox"
                                  type="checkbox"
                                  name="channel"
                                  className="channel check"
                                  value={channel.id}
                                />
                                {channel.name}
                              </label>
                            </div>
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
                            <div className="field">
                              <label>
                                <input
                                  aria-setsize={this.state.usergroups.length}
                                  aria-posinset={i + 1}
                                  aria-labelledby={"check-label-" + (i + 1)}
                                  aria-checked="false"
                                  tabIndex="0"
                                  role="checkbox"
                                  type="checkbox"
                                  className="usergroup check"
                                  name="usergroup"
                                  value={usergroup.id}
                                />
                                {usergroup.name}
                              </label>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
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
    const input = event.currentTarget.querySelector("input");
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
