import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";

// Common
import Navbar from "../common/Navbar";
import Register from "../auth/Register";
import Login from "../auth/Login";
import NotFound from "../common/NotFound";
import Footer from "../common/Footer";
import TestNavbar from "../common/TestNavbar";

// Dashboard
import Dashboard from "../dashboard/Dashboard";

// Index Page
import Index from "./Index";

// About Page
import About from "../aboutPage/About";

// Post Page
import Post from "../postPage/Post";

// Contact Page
import Contact from "../contactPage/Contact";

console.log(localStorage.jwtToken);

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
          {localStorage.jwtToken ? <TestNavbar /> : <Navbar />}
          <Switch>
            <Route exact path="/" component={Index} />
            <Route exact path="/about" component={About} />
            <Route exact path="/post" component={Post} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route component={NotFound} />
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}
