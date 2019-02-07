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
      user_id: props.user_id,
      likes: props.likes,
      dislikes: props.dislikes,
      hotness: props.likes.length - props.dislikes.length,
      isLike: false,
      isDislike: false,
      loginModal: false,
      deleteModal: false,
      showDeleteEdit: false,
      isFavor: false
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
    this.setState(
      {
        user_id: newProps.user_id,
        likes: newProps.likes,
        dislikes: newProps.dislikes,
        isLike,
        isDislike,
        hotness: newProps.likes.length - newProps.dislikes.length,
        isFavor: newProps.isFavor
      },
      () => {
        // check if userid matches userid of userid of posts
        let userid;
        if (localStorage.jwtToken) {
          userid = jwt_decode(localStorage.jwtToken).id;
          if (userid === this.state.user_id) {
            this.setState({ showDeleteEdit: true });
          }
        }
      }
    );
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

  // Add Favorite
  onPostFavor = () => {
    if (localStorage.jwtToken) {
      // set thumb at front-end
      this.setState(prevState => ({ isFavor: !prevState.isFavor }));

      // send request to backend
      setAuthToken(localStorage.jwtToken);
      axios
        .post(`/api/posts/favorite/${this.state.post_id}`)
        .then(res => {
          console.log("Add to favorite successfully!");
        })
        .catch(err => {
          console.log(err.response.data);
        });
    } else {
      // if user not logged in
      this.setState({ loginModal: true });
    }
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
          onGotoIndex={this.props.onGotoIndex}
        />
        <div className="row">
          <div className="view-bar ml-5">
            <i className="fab fa-hotjar" style={{ color: "red" }} />{" "}
            <span className="hot-width">{this.state.hotness} </span>
          </div>
          <div className="division-bar">
            <i className="fas fa-grip-lines-vertical ml-3 mr-3" />
          </div>
          <div className="view-bar" onClick={this.onPostLike}>
            <i
              className={classnames("far fa-thumbs-up ml-1 mr-2", {
                "red-thumb": this.state.isLike,
                "red-thumb-animation": this.state.isLike,
                fas: this.state.isLike
              })}
            />
            Like
          </div>
          <div className="division-bar">
            <i className="fas fa-grip-lines-vertical ml-3 mr-3" />
          </div>
          <div className="view-bar" onClick={this.onPostDislike}>
            <i
              className={classnames("far fa-thumbs-down ml-1 mr-2", {
                "blue-thumb": this.state.isDislike,
                "blue-thumb-animation": this.state.isDislike,
                fas: this.state.isDislike
              })}
            />
            Dislike
          </div>{" "}
          <div className="division-bar">
            <i className="fas fa-grip-lines-vertical ml-3 mr-3" />
          </div>
          <div className="view-bar" onClick={this.onPostFavor}>
            <i
              className={classnames("far fa-heart mr-2 animated", {
                pale: this.state.isFavor,
                fas: this.state.isFavor,
                rubberBand: this.state.isFavor
              })}
            />
            Favorite
          </div>{" "}
          <div className="division-bar">
            <i className="fas fa-grip-lines-vertical ml-3 mr-3" />
          </div>
          <div className="view-bar" onClick={this.onForward}>
            <i
              className="fas fa-share-square mr-2"
              style={{ color: "orange" }}
            />
            Forward{" "}
          </div>{" "}
          <div className="division-bar">
            {this.state.showDeleteEdit && (
              <i className="fas fa-grip-lines-vertical ml-3 mr-3" />
            )}
          </div>
          {this.state.showDeleteEdit && (
            <div className="delete-bar">
              <div className="view-bar" onClick={this.onDeletePost}>
                <i
                  className="fas fa-trash-alt mr-2"
                  style={{ color: "rgb(189, 202, 5)" }}
                />
                Delete
              </div>
              <div className="division-bar">
                <i className="fas fa-grip-lines-vertical ml-3 mr-3" />
              </div>
            </div>
          )}
          {this.state.showDeleteEdit && (
            <div className="view-bar" onClick={() => this.props.onGotoEdit()}>
              <i className="fas fa-edit mr-2" style={{ color: "purple" }} />
              Edit
            </div>
          )}
        </div>
      </div>
    );
  }
}
