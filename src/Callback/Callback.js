import React, { Component } from 'react';
import loading from './loading.svg';

export default class Callback extends Component {
  render(props) {
    return (
      <div>
        <img src={loading} alt="loading"/>
      </div>
    );
  }
}
