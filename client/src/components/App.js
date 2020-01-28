import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import DataModel from './pages/DataModel';
import ImageModel from './pages/ImageModel';
import Create from './pages/Create';
import NavBar from './modules/NavBar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Learn from './pages/Learn';

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";
import SketchModel from "./pages/SketchModel";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id });
      }
    });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout");
  };

  render() {
    return (
      <>
        <NavBar handleLogin={(res) => this.handleLogin(res)} handleLogout={() => this.handleLogout()} userId={this.state.userId} />
        <Router primary={false}>
          <Home path="/" userId={this.state.userId} handleLogin={(res) => this.handleLogin(res)}/>
          <Create path='/create/' userId={this.state.userId} />
          <Learn path='/learn/' userId={this.state.userId}/>
          <DataModel path='/datamodel/:name' userId={this.state.userId}/>
          <DataModel path='/datamodel' userId={this.state.userId}/>
          <ImageModel path='/imagemodel/:name' userId={this.state.userId}/>
          <ImageModel path='/imagemodel' userId={this.state.userId}/>
          <SketchModel path='/sketchmodel/:name' userId={this.state.userId}/>
          <SketchModel path='/sketchmodel' userId={this.state.userId}/>
          <Profile path='/profile/:userId' userID={this.state.userId}/>
          <NotFound default />
        </Router>
        
      </>
    );
  }
}

export default App;
