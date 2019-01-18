import React from "react";
import axios from "axios";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
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

    const User = {
      username: this.state.username,
      password: this.state.password
    };

    axios
      .post("http://localhost:8081/api/users/login", User)
      .then(res => console.log(res.data))
      .catch(err => console.log(err.response.data));
  };

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          username:{" "}
          <input
            type="text"
            name="username"
            placeholder="username"
            value={this.state.username}
            onChange={this.onChange}
          />
          <br />
          password:{" "}
          <input
            type="text"
            name="password"
            placeholder="password"
            value={this.state.password}
            onChange={this.onChange}
          />
          <br />
          <input type="submit" value="submit" />
        </form>
      </div>
    );
  }
}
