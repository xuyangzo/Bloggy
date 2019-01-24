import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "./Header";
import Navbar from "../common/Navbar";
import Body from "./Body";
import Register from "../auth/Register";
import Login from "../auth/Login";
import Footer from "../common/Footer";
export default class Bloggy extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Header />
          <Route exact path="/" component={Body} />
          <div className="container">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}
