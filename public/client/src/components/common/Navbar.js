import React from "react";
import { Link } from "react-router-dom";
import Headroom from "react-headroom";
import SearchBar from "./SearchBar";

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
      unpin: false
    };
  }
  handleOnUnpin = e => {
    this.setState({ unpin: true });
    // console.log("unpin");
  }
  onGotoSearch = e =>{
    this.props.history.push(`/search/${e}`);
  }
  render() {
    return (
      <Headroom onUnpin={this.handleOnUnpin}>
        <nav
          className="navbar navbar-expand-md navbar-light bg-light"
          id="mainNav"
        >
          <div className="container">
            <Link className="navbar-brand" to="/">
              Bloggy
            </Link>
            <button
              className="navbar-toggler navbar-toggler-right"
              type="button"
              data-toggle="collapse"
              data-target="#navbarResponsive"
              aria-controls="navbarResponsive"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <div className="ml-auto">
                <SearchBar initial={this.state.unpin} onGotoSearch={this.onGotoSearch} />
              </div>
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Sign Up
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </Headroom>
    );
  }
}
