import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

class LoginNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: ""
    };
  }

  componentDidMount = e => {
    // retrieve avatar and userid
    if (localStorage.jwtToken) {
      setAuthToken(localStorage.jwtToken);
      axios
        .get("/api/users/current")
        .then(res => {
          this.setState({ avatar: res.data.avatar });
        })
        .catch(err => {
          console.log(err.response.data);
        });
    }
  };

  onClick = e => {
    e.preventDefault();
    localStorage.removeItem("jwtToken");
    location.href = "/";
  };

  onImgClick = e => {
    this.props.history.push("/dashboard");
  };

  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-light bg-light">
        <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <Link className="navbar-brand" to="/">
                Bloggy
              </Link>
            </li>
          </ul>
        </div>
        <div className="mx-auto order-0">
          <SearchBar />
        </div>
        <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <img
                className="profile-img mt-1"
                alt="profile picture"
                src={this.state.avatar}
                onClick={this.onImgClick}
              />
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#" onClick={this.onClick}>
                Log Out
              </a>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default LoginNavbar;
