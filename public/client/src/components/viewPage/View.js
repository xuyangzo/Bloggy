import React from "react";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import ViewHeader from "./ViewHeader";
import Comment from "./Comment";
import Thumb from "./Thumb";
import LoginModal from "../common/LoginModal";
import Loader from "../utils/Loader";

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldRender: false,
      post_id: props.match.params.post_id,
      userid: "",
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
          shouldRender: true,
          userid: res.data.linked_userid,
          title: res.data.title,
          subtitle: res.data.subtitle,
          text: res.data.text,
          author: res.data.author,
          sources: res.data.sources,
          dateTime: res.data.dateTime,
          comments: res.data.comments,
          likes: res.data.likes,
          dislikes: res.data.dislikes,
          loginModal: false
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

  clearModal = () => {
    this.setState({ loginModal: false });
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

  // push to index
  onGotoIndex = () => {
    this.props.history.push("/");
  };

  // push to edit
  onGotoEdit = () => {
    this.props.history.push({
      pathname: `/edit/${this.state.post_id}`,
      title: this.state.title,
      subtitle: this.state.subtitle,
      text: this.state.text,
      sources: this.state.sources
    });
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
      this.setState({ loginModal: true });
    }
  };

  render() {
    return (
      <div className="container col-md-8 m-auto">
        {this.state.shouldRender && <Loader />}
        <LoginModal
          modalIsOpen={this.state.loginModal}
          clearModal={this.clearModal}
        />
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
        SOURCES
        {this.state.sources &&
          this.state.sources.map(source => {
            return <div key={source}>{source}</div>;
          })}
        <br />
        <br />
        <Thumb
          post_id={this.state.post_id}
          dislikes={this.state.dislikes}
          likes={this.state.likes}
          onGotoDashboard={this.onGotoDashboard}
          onGotoIndex={this.onGotoIndex}
          onGotoEdit={this.onGotoEdit}
          user_id={this.state.userid}
        />
        {this.state.shouldRender && (
          <div>
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
          </div>
        )}
        <br />
        <br />
        <br />
        <Comment
          allComments={this.state.comments}
          post_id={this.state.post_id}
          onGotoDashboard={this.onGotoDashboard}
          shouldRender={this.state.shouldRender}
        />
      </div>
    );
  }
}
