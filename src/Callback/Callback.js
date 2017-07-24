import React, { Component } from "react";
import history from "./../history";
import loading from "./loading.svg";
import { AUTH } from "./../tokens";

export default class Callback extends Component {
  componentDidMount() {
    const params = this.props.location.search;
    localStorage.setItem('code', getCode(params));
    history.replace('/')
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
