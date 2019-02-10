import React from "react";
import axios from "axios";
import Moment from "react-moment";

export default class ViewHeader extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      userid: props.userid,
      dateTime: props.dateTime,
      author: props.author,
      onGotoDashboard: props.onGotoDashboard,
      description: ""
    };
  }

  componentWillReceiveProps = newProps => {
    this.setState(
      {
        title: newProps.title,
        userid: newProps.userid,
        dateTime: newProps.dateTime,
        author: newProps.author
      },
      () => {
        // retrieve description
        axios
          .get(`/api/users/${this.state.userid}`)
          .then(res => {
            this.setState({
              description: res.data.description,
              avatar: res.data.avatar
            });
          })
          .catch(err => console.log(err.response.data));
      }
    );
  };

  render() {
    return (
      <div className="container text-center ">
        <br />
        <br />
        <h1 className="blog-title">{this.state.title}</h1>
        {this.state.dateTime ? (
          <Moment className="blog-date" format="MMMM Do YYYY, hh:mm a">
            {this.state.dateTime}
          </Moment>
        ) : (
          ""
        )}

        <div className="blog-author-intro mt-5 pb-3">
          <img
            src={this.state.avatar}
            className="author-img"
            onClick={() => this.state.onGotoDashboard(this.state.userid)}
          />
          <p
            className="blog-author ml-3"
            onClick={() => this.state.onGotoDashboard(this.state.userid)}
          >
            {this.state.author}
          </p>
          <p className="author-description">{this.state.description}</p>
        </div>
      </div>
    );
  }
}
