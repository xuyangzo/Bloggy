require("@babel/polyfill");

import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Provider } from "react-redux";
import appstore from "../../store/store";
import { setCurrentUser } from "../../actions/authActions";
import setAuthToken from "../utils/setAuthToken";

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
import Setting from "../profile/Setting";

// Index Page
import Index from "./Index";

// Post Page
import Editor from "../postPage/Editor";

//Search Page
import Search from "../searchPage/Search";

const store = appstore();

// Check for token
if (localStorage.jwtToken) {
  // set auth token
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken);
  // set current user
  store.dispatch(setCurrentUser(decoded));
  // Check for expire token
  const currentTime = Date.now() / 10000;
  if (decoded.exp < currentTime) {
    // Logout user
    localStorage.removeItem("jwtToken");
    // Redirect to login
    window.location.href = "/login";
  }
}

class Bloggy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    };

    store.subscribe(() => {
      this.setState({ isAuthenticated: store.getState().auth.isAuthenticated });
    });
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Route
              path="/"
              component={
                store.getState().auth.isAuthenticated ? LoginNavbar : Navbar
              }
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
              <Route
                exact
                path="/setting"
                component={localStorage.jwtToken ? Setting : Unauthorized}
              />
              <Route component={NotFound} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default Bloggy;
