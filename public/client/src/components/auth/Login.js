import React from "react";
import TextFieldGroup from "../common/TextFieldGroup";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
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

    const User = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(User);
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="mt-5 login-container">
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

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(withRouter(Login));
