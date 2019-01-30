import React from "react";
import Moment from "react-moment";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

export default class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allComments: props.allComments ? props.allComments : []
    };
  }

  componentWillReceiveProps = newProps => {
    this.setState({ allComments: newProps.allComments });
  };

  onReply = () => {
    if (localStorage.jwtToken) {
      setAuthToken(localStorage.jwtToken);
      // TODO::Reply comments
    } else {
      alert("Please login first!");
    }
  };

  render() {
    return (
      <div>
        <p>POPULAR COMMENTS</p>
        <hr />
        {this.state.allComments.map(comment => {
          return (
            <div className="container" key={comment._id}>
              <div>
                <img src={comment.avatar} />
                <h3>{comment.username}</h3>
              </div>
              <Moment format="MMMM Do YYYY, hh:mm a">{comment.dateTime}</Moment>
              <p>{comment.text}</p>
              <button className="btn" onClick={() => this.onReply()}>
                reply
              </button>
            </div>
          );
        })}
      </div>
    );
  }
}
