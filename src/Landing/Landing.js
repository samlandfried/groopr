import React, { Component } from "react";
import AddToSlack from "./AddToSlack/AddToSlack";

export default class Landing extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="landing">
        <div className="text">
        <p className="text-on-image">
          Groopr quickly assigns members of your Slack team
          into groups so they can focus on working instead of, well, grouping.
        </p>
        <AddToSlack />
        <p className="text-on-image">or checkout the code</p>
        <a className="btn" href="https://www.github.com/samlandfried/poodr-react">
          <img
            src={require("../img/Octocat.png")}
            alt="GitHub OctoCat logo"
            height="30px"
          />{" "}
          on <strong>GitHub</strong>
        </a>
        </div>
        <div className="video">
        <iframe src="https://player.vimeo.com/video/229936732?autoplay=1&loop=1&title=0&byline=0&portrait=0" width="640" height="400" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
        </div>
      </div>
    );
  }
}
