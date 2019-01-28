import React from "react";
import axios from "axios";
import TextFieldGroup from "../common/TextFieldGroup";
import setAuthToken from "../utils/setAuthToken";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const User = {
      email: this.state.email,
      password: this.state.password
    };

    axios
      .post("/api/users/login", User)
      .then(res => {
        console.log(res.data);
        // Save to localstorage
        const { token } = res.data;
        localStorage.setItem("jwtToken", token);
        // Set token to Auth header
        setAuthToken(token);
        // Set current user
        location.href = "/dashboard";
        // this.props.history.push("/dashboard");
      })
      .catch(err => {
        this.setState({ errors: err.response.data });
        console.log(err.response.data);
      });
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="row mt-5">
        <div className="col-md-8 m-auto">
          <h1 className="display-4 text-center title-font">Log In</h1>
          <p className="lead text-center subtitle-font">
            Login with your Bloggy account
          </p>
          <form onSubmit={this.onSubmit}>
            <TextFieldGroup
              placeholder="Email"
              name="email"
              id="email-field"
              type="text"
              value={this.state.email}
              onChange={this.onChange}
              error={errors.email}
            />
            <TextFieldGroup
              placeholder="Password"
              name="password"
              id="password-field"
              type="password"
              value={this.state.password}
              onChange={this.onChange}
              error={errors.password}
            />
            <input
              className="form-control submit-button"
              type="submit"
              value="submit"
            />
          </form>
        </div>
      </div>
    );
  }
}
