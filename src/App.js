import React, { Component } from "react";
import { Navbar, Button } from "react-bootstrap";
import Poodr from "./Poodr/Poodr";
import "./App.css";
import AddToSlack from './AddToSlack/AddToSlack';

class App extends Component {
  render() {
    return (
      <div id="App">
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Brand id="navbar-brand">
              <a href="#">Poodr</a>
            </Navbar.Brand>
            <AddToSlack />
          </Navbar.Header>
        </Navbar>
      </div>
    );
  }
}

export default App;
