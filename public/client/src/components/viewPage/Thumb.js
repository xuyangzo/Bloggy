import React from "react";
import axios from "axios";
import classnames from "classnames";
import jwt_decode from "jwt-decode";

import setAuthToken from "../utils/setAuthToken";
import LoginModal from "../common/LoginModal";
import DeleteModal from "../common/DeleteModal";

export default class Thumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post_id: props.post_id,
      likes: props.likes,
      dislikes: props.dislikes,
      hotness: props.likes.length - props.dislikes.length,
      isLike: false,
      isDislike: false,
      loginModal: false,
      deleteModal: false
    };
  }

  componentWillReceiveProps = newProps => {
    // decode jwt_token
    let userid;
    if (localStorage.jwtToken) {
      userid = jwt_decode(localStorage.jwtToken).id;
    }
    // check if user already likes
    var isLike = false;
    var isDislike = false;
    for (var i = 0; i < newProps.likes.length; i++) {
      if (newProps.likes[i].linked_like_userid === userid) {
        isLike = true;
        break;
      }
    }
    // check if user already dislike
    if (!isLike) {
      for (var i = 0; i < newProps.dislikes.length; i++) {
        if (newProps.dislikes[i].linked_dislike_userid === userid) {
          isDislike = true;
          break;
        }
      }
    }
    this.setState({
      likes: newProps.likes,
      dislikes: newProps.dislikes,
      isLike,
      isDislike,
      hotness: newProps.likes.length - newProps.dislikes.length
    });
  };

  onPostLike = () => {
    if (localStorage.jwtToken) {
      // set thumb at front-end
      let hotCount = 0;
      if (this.state.isLike) hotCount = -1;
      else if (this.state.isDislike) hotCount = 2;
      else hotCount = 1;

      this.setState(prevState => ({
        isLike: !prevState.isLike,
        isDislike: false,
        hotness: prevState.hotness + hotCount
      }));

      // send request to back-end
      setAuthToken(localStorage.jwtToken);
      axios
        .post("/api/posts/like/" + this.state.post_id)
        .then(res => {
          this.setState({
            likes: res.data.likes,
            dislikes: res.data.dislikes
          });
        })
        .catch(err => {
          console.log(err.response.data);
        });
    } else {
      // if user not logged in
      this.setState({ loginModal: true });
    }
  };

  onPostDislike = () => {
    if (localStorage.jwtToken) {
      // set thumb at front-end
      let hotCount = 0;
      if (this.state.isLike) hotCount = -2;
      else if (this.state.isDislike) hotCount = 1;
      else hotCount = -1;

      this.setState(prevState => ({
        isLike: false,
        isDislike: !prevState.isDislike,
        hotness: prevState.hotness + hotCount
      }));

      // send request to back-end
      setAuthToken(localStorage.jwtToken);
      axios
        .post("/api/posts/dislike/" + this.state.post_id)
        .then(res => {
          this.setState({
            likes: res.data.likes,
            dislikes: res.data.dislikes
          });
        })
        .catch(err => {
          console.log(err.response.data);
        });
    } else {
      // if user not logged in
      this.setState({ loginModal: true });
    }
  };

  // clear login modal
  clearModal = () => {
    this.setState({ loginModal: false, deleteModal: false });
  };

  // Delete Post
  onDeletePost = () => {
    this.setState({ deleteModal: true });
  };

  render() {
    return (
      <div className="text-center">
        <LoginModal
          modalIsOpen={this.state.loginModal}
          clearModal={this.clearModal}
        />
        <DeleteModal
          modalIsOpen={this.state.deleteModal}
          clearModal={this.clearModal}
          post_id={this.state.post_id}
        />
        <div class="row">
          <div className="view-bar ml-5">
            <i class="fab fa-hotjar" style={{ color: "red" }} />{" "}
            <span className="hot-width">{this.state.hotness} </span>
            <i class="fas fa-grip-lines-vertical ml-3 mr-3" />
          </div>
          <div className="view-bar" onClick={this.onPostLike}>
            <i
              className={classnames("far fa-thumbs-up ml-2 mr-2", {
                "red-thumb": this.state.isLike,
                "red-thumb-animation": this.state.isLike,
                fas: this.state.isLike
              })}
            />
            Like <i class="fas fa-grip-lines-vertical ml-3 mr-3" />
          </div>
          <div className="view-bar" onClick={this.onPostDislike}>
            <i
              className={classnames("far fa-thumbs-down ml-2 mr-2", {
                "blue-thumb": this.state.isDislike,
                "blue-thumb-animation": this.state.isDislike,
                fas: this.state.isDislike
              })}
            />
            Dislike <i class="fas fa-grip-lines-vertical ml-3 mr-3" />
          </div>{" "}
          <div className="view-bar" onClick={this.onDeletePost}>
            <i
              class="fas fa-trash-alt mr-2"
              style={{ color: "rgb(189, 202, 5)" }}
            />
            Delete <i class="fas fa-grip-lines-vertical ml-3 mr-3" />
          </div>
        </div>
      </div>
    );
  }
}
