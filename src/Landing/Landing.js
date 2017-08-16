import React, { Component } from "react";
import AddToSlack from "./AddToSlack/AddToSlack";

export default class Landing extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="landing">
        <p id="landing-blurb">
          Groopr quickly and intelligently assigns members of your Slack team
          into groups so they can focus on working instead of, well, grouping.
        </p>
        <AddToSlack />
        <p>or read about everything Groopr can do</p>
        <a className="btn" href="https://www.github.com/samlandfried/poodr-react">
          <img
            src={require("../img/Octocat.png")}
            alt="GitHub OctoCat logo"
            height="30px"
          />{" "}
          on <strong>GitHub</strong>
        </a>
      </div>
    );
  }
}
