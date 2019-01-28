import React from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";
import Unauthorized from "../utils/Unauthorized";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem("jwtToken");
    this.state = {
      token
    };

    // test post
    // axios
    //   .post("/api/posts/create", Blog)
    //   .then(res => {
    //     console.log(res.data);
    //   })
    //   .catch(err => {
    //     this.setState({ errors: err.response.data });
    //     console.log(err.response.data);
    //   });
  }

  render() {
    return (
      <div>{this.state.token ? <h1>From dashboard</h1> : <Unauthorized />}</div>
    );
  }
}
