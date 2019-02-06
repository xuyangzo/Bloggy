import React from "react";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import ViewHeader from "./ViewHeader";
import Comment from "./Comment";
import Thumb from "./Thumb";

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post_id: props.match.params.post_id,
      title: "",
      subtitle: "",
      text: "",
      author: "",
      sources: "",
      dateTime: "",
      mycomment: "",
      likes: [],
      dislikes: []
    };
  }

  componentDidMount = () => {
    axios
      .get("/api/posts/view/" + this.state.post_id)
      .then(res => {
        this.setState({
          userid: res.data.linked_userid,
          title: res.data.title,
          subtitle: res.data.subtitle,
          text: res.data.text,
          author: res.data.author,
          sources: res.data.sources,
          dateTime: res.data.dateTime,
          comments: res.data.comments,
          likes: res.data.likes,
          dislikes: res.data.dislikes
        });
      })
      .catch(err => {
        this.setState({ errors: err.response.data });
        console.log(err.response.data);
      });
  };

  onChangeComment = e => {
    this.setState({ mycomment: e.target.value });
  };

  createMarkup = () => {
    return { __html: this.state.text };
  };

  // push to dashboard
  onGotoDashboard = userid => {
    // verify if the profile matches current user
    if (localStorage.jwtToken) {
      const token = jwt_decode(localStorage.jwtToken);
      if (token.id === userid) {
        this.props.history.push(`/dashboard`);
      } else {
        this.props.history.push(`/profile/${userid}`);
      }
    } else {
      // if the user does not log in
      // directly forward to dashboard with public router
      this.props.history.push(`/profile/${userid}`);
    }
  };

  onPostComment = e => {
    e.preventDefault();

    if (localStorage.jwtToken) {
      setAuthToken(localStorage.jwtToken);
      const singleComment = {
        text: this.state.mycomment
      };
      axios
        .post("/api/posts/comment/" + this.state.post_id, singleComment)
        .then(res => {
          this.setState({ comments: res.data.comments });
          document.getElementById("comment").value = "";
        })
        .catch(err => {
          this.setState({ errors: err.response.data });
          console.log(err.response.data);
        });
    } else {
      // if there is no auth token
      // user need to login first
      alert("Need to login first");
    }
  };

  render() {
    return (
      <div className="container col-md-8 m-auto">
        <ViewHeader
          title={this.state.title}
          userid={this.state.userid}
          dateTime={this.state.dateTime}
          author={this.state.author}
          onGotoDashboard={this.onGotoDashboard}
        />
        <hr style={{ width: "70%", marginLeft: "30px" }} />
        <br />
        <div className="container single-post">
          <div dangerouslySetInnerHTML={this.createMarkup()} />
        </div>
        <br />
        <Thumb
          post_id={this.state.post_id}
          dislikes={this.state.dislikes}
          likes={this.state.likes}
        />
        <hr />
        <form onSubmit={this.onPostComment} id="post-comment-form">
          <div className="form-group">
            <p>LEAVE COMMENTS</p>
            <textarea
              className="form-control"
              placeholder="Leave any comments here..."
              rows="5"
              name="comment"
              id="comment"
              onChange={this.onChangeComment}
            />
          </div>
          <input
            type="submit"
            name="submit"
            value="COMMENT"
            className="form-control comment-button"
          />
        </form>
        <br />
        <br />
        <br />
        <Comment
          allComments={this.state.comments}
          post_id={this.state.post_id}
          onGotoDashboard={this.onGotoDashboard}
        />
      </div>
    );
  }
}
