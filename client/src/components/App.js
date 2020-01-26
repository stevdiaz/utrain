import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import 'filepond/dist/filepond.min.css';
import DataModel from './pages/DataModel';
import ImageModel from './pages/ImageModel';
import Create from './pages/Create';
import NavBar from './modules/NavBar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Learn from './pages/Learn';
import DrawTest from './modules/DrawTest';

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";
import DataCollectCard from "./modules/DataCollectCard.js";

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
          <Create path='/create/' />
          <Learn path='/learn/' />
          <DataModel path='/datamodel/:name' />
          <DataModel path='/datamodel'/>
          <ImageModel path='/imagemodel/:name' />
          <ImageModel path='/imagemodel'/>
          <Profile path='/profile/:userId' />
          <NotFound default />
        </Router>
        
      </>
    );
  }
}

export default App;
