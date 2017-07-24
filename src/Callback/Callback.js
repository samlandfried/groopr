import React, { Component } from "react";
import loading from "./loading.svg";
import { AUTH } from './../tokens';

export default class Callback extends Component {
  componentDidMount() {
    const code = getCode(this.props.location.search);
    const url =  `https://slack.com/api/oauth.access?client_id=${AUTH.clientId}&client_secret=${AUTH.clientSecret}&code=${code}&pretty=1`
    fetch(url)
    .then(resp => resp.json())
    .then(data => { debugger } )
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
