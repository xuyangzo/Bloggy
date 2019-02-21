import React from "react";
import "../common/TextFieldGroup";
import TextFieldGroup from "../common/TextFieldGroup";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { registerUser } from "../../actions/authActions";

class Register extends React.Component {
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

  // if user already logs in, push it to dashboard
  componentDidMount = () => {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentWillReceiveProps = newProps => {
    if (newProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  };

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="mt-5 signup-container">
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

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
