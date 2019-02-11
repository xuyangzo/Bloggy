require("@babel/polyfill");

import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";

// Common
import Navbar from "../common/Navbar";
import Register from "../auth/Register";
import Login from "../auth/Login";
import NotFound from "../common/NotFound";
import Footer from "../common/Footer";
import LoginNavbar from "../common/LoginNavbar";
import View from "../viewPage/View";
import Unauthorized from "../utils/Unauthorized";

// Profile
import Profile from "../profile/Profile";

// Index Page
import Index from "./Index";

// Post Page
import Editor from "../postPage/Editor";

//Search Page
import Search from "../searchPage/Search";

// Check for token
if (localStorage.jwtToken) {
  // Decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken);
  // Check for expire token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    localStorage.removeItem("jwtToken");
    // Redirect to login
    window.location.href = "/login";
  }
}

export default class Bloggy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    };
  }

  render() {
    return (
      <Router>
        <div>
          <Route
            path="/"
            component={localStorage.jwtToken ? LoginNavbar : Navbar}
          />
          <Switch>
            <Route exact path="/" component={Index} />
            <Route
              exact
              path="/post"
              component={localStorage.jwtToken ? Editor : Unauthorized}
            />
            <Route
              exact
              path="/edit/:post_id"
              component={localStorage.jwtToken ? Editor : Unauthorized}
            />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            {/* <Route
              exact
              path="/dashboard"
              component={localStorage.jwtToken ? Dashboard : Unauthorized}
            /> */}
            <Route exact path="/profile/:userid" component={Profile} />
            <Route exact path="/view/:post_id" component={View} />
            <Route exact path="/search/:keyword" component={Search} />
            <Route component={NotFound} />
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}
