import React from "react";
import axios from "axios";
import "../common/TextFieldGroup";
import TextFieldGroup from "../common/TextFieldGroup";

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    axios
      .post("/api/users/register", newUser)
      .then(res => console.log(res.data))
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
          <h1 className="display-4 text-center title-font">Sign Up</h1>
          <p className="lead text-center subtitle-font">
            Sign Up with your Bloggy account
          </p>
          <form onSubmit={this.onSubmit}>
            <TextFieldGroup
              placeholder="Username"
              name="username"
              id="username-field"
              type="text"
              value={this.state.username}
              onChange={this.onChange}
              error={errors.username}
            />
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
              type="text"
              value={this.state.password}
              onChange={this.onChange}
              error={errors.password}
            />
            <TextFieldGroup
              placeholder="Password2"
              name="password2"
              id="password2-field"
              type="text"
              value={this.state.password2}
              onChange={this.onChange}
              error={errors.password2}
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
