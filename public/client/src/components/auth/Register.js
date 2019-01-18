import React from "react";
import axios from "axios";

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

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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
      .post("http://localhost:8081/api/users/register", newUser)
      .then(res => console.log(res.data))
      .catch(err => console.log(err.response.data));
  };

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          username:
          <input
            type="text"
            name="username"
            placeholder="username"
            value={this.state.username}
            onChange={this.onChange}
          />
          <br />
          email:
          <input
            type="text"
            name="email"
            placeholder="email"
            value={this.state.email}
            onChange={this.onChange}
          />
          <br />
          password:
          <input
            type="text"
            name="password"
            placeholder="password"
            value={this.state.password}
            onChange={this.onChange}
          />
          <br />
          confirm password:
          <input
            type="text"
            placeholder="confirm password"
            name="password2"
            value={this.state.password2}
            onChange={this.onChange}
          />
          <br />
          <input type="submit" value="submit" />
        </form>
      </div>
    );
  }
}
