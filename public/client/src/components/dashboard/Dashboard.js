import React from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";
import Unauthorized from "../utils/Unauthorized";

import DashboardContent from "./DashboardContentPublic";

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

  onClickPost = post_id => {
    this.props.history.push(`/view/${post_id}`);
  };

  render() {
    return (
      <div class="container my-5" style={{ paddingTop: "65px"}}>
        <div class="row justify-content-md-center">
          <div class="col-sm-10 col-md-8 mx-auto">
            {this.state.token ? <DashboardContent onClickPost={this.onClickPost}/> : <Unauthorized />}
          </div>
        </div>
      </div>
    );
  }
}
