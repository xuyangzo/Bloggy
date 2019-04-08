import React from "react";
import axios from "axios";
import classnames from "classnames";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
import { setLoginModal } from "../../actions/modalActions";
import PropTypes from "prop-types";

import setAuthToken from "../utils/setAuthToken";
import DeleteModal from "../common/DeleteModal";

class Thumb extends React.Component {
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
      this.props.setLoginModal();
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
      this.props.setLoginModal();
    }
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
      this.props.setLoginModal();
    }
  };

  render() {
    return (
      <div className="text-center">
        {/* <LoginModal
          modalIsOpen={this.state.loginModal}
          clearModal={this.clearModal}
        /> */}
        <DeleteModal
          modalIsOpen={this.state.deleteModal}
          clearModal={this.clearModal}
          post_id={this.state.post_id}
          onGotoIndex={this.props.onGotoIndex}
        />
        <aside className="row view-sidebar">
          <div className="view-bar">
            <i className="fab fa-hotjar" style={{ color: "red" }} />{" "}
            <span className="hot-width">{this.state.hotness} </span>
          </div>
          <div className="view-bar" onClick={this.onPostLike}>
            <i
              className={classnames("fas fa-thumbs-up mr-2 up-icon", {
                "red-thumb": this.state.isLike,
                "red-thumb-animation": this.state.isLike
              })}
            />
          </div>
          <div className="view-bar" onClick={this.onPostDislike}>
            <i
              className={classnames("fas fa-thumbs-down mr-2 down-icon", {
                "blue-thumb": this.state.isDislike,
                "blue-thumb-animation": this.state.isDislike
              })}
            />
          </div>{" "}
          <div className="view-bar" onClick={this.onPostFavor}>
            <i
              className={classnames("fas fa-heart mr-2 animated fav-icon", {
                pale: this.state.isFavor,
                rubberBand: this.state.isFavor
              })}
            />
          </div>{" "}
          <div className="view-bar" onClick={this.onForward}>
            <i className="fas fa-share-square mr-2 share-icon" title="share!" />
          </div>{" "}
          {this.props.auth.user.id === this.state.user_id && (
            <div className="delete-bar">
              <div className="view-bar" onClick={this.onDeletePost}>
                <i className="fas fa-trash-alt mr-2 delete-icon" />
              </div>
            </div>
          )}
          {this.props.auth.user.id === this.state.user_id && (
            <div className="view-bar" onClick={() => this.props.onGotoEdit()}>
              <i className="fas fa-edit mr-2 edit-icon" />
            </div>
          )}
        </aside>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  setLoginModal: () => dispatch(setLoginModal(true))
});

Thumb.propTypes = {
  auth: PropTypes.object.isRequired,
  setLoginModal: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Thumb);
