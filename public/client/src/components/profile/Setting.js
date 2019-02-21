import React from "react";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

export default class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subscribe: "",
      language: ""
    };
  }

  componentDidMount = () => {
    document.title = "Settings";
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    // send request to backend
    setAuthToken(localStorage.jwtToken);

    console.log(this.state);
  };

  render() {
    return (
      <div className="container mt-5 setting-container">
        <div className="col-10 mx-auto">
          <div className="subscription">
            <form
              className="form-group update-subscribe"
              onSubmit={this.onSubmit}
            >
              <div className="single-choice">
                <label htmlFor="subscribe">Subscription Preference</label>
                <select
                  id="subscribe"
                  className="select-input"
                  name="subscribe"
                  value={this.state.value}
                  onChange={this.onChange}
                >
                  <option value="week">Every Week</option>
                  <option value="day">Every Day</option>
                  <option value="month">Every Month</option>
                  <option value="unsubscribe">Unsubscribe</option>
                </select>
              </div>
              <div className="single-choice">
                <label htmlFor="language">Language Preference</label>
                <select
                  id="language"
                  name="language"
                  className="select-input"
                  value={this.state.language}
                  onChange={this.onChange}
                >
                  <option value="english">English</option>
                  <option value="chinese">Chinese</option>
                </select>
              </div>
              <input
                type="submit"
                value="update"
                className="select-button btn"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
