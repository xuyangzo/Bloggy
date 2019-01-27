import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Common
import Navbar from "../common/Navbar";
import Register from "../auth/Register";
import Login from "../auth/Login";
import NotFound from "../common/NotFound";
import Footer from "../common/Footer";

// Index Page
import Index from "./Index";

// About Page
import About from "../aboutPage/About";

// Post Page
import Post from "../postPage/Post";

// Contact Page
import Contact from "../contactPage/Contact";

export default class Bloggy extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Index} />
            <Route exact path="/about" component={About} />
            <Route exact path="/post" component={Post} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route component={NotFound} />
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}
