import React, { Component } from 'react';

export default class Poodr extends Component {
  render(props) {
    return (
      <p>
        {localStorage.access_token}
      </p>
    );
  }
}