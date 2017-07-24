import React, { Component } from "react";
import loading from "./loading.svg";
import { AUTH } from './../tokens';

export default class Callback extends Component {
  componentDidMount() {
    const code = getCode(this.props.location.search);
    // https://slack.com/api/oauth.access?client_id=asdf&client_secret=asdf&code=asdf&redirect_uri=asdf&pretty=1
    console.log(AUTH)
    debugger
  }

  render(props) {
    return (
      <div>
        <img src={loading} alt="loading" />
      </div>
    );
  }
}

const getCode = queryString => {
  const firstParam = queryString.split("&")[0];
  const code = firstParam.split("=")[1];
  return code;
};
