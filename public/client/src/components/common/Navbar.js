import React from "react";
import { Link } from "react-router-dom";

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Link to="/register">Sign Up</Link>
        <Link to="/login">Log In</Link>
      </div>
    );
  }
}
