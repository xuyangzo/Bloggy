import React from "react";
import axios from "axios";
import classnames from "classnames";
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";

export default class Thumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post_id: props.post_id,
      likes: props.likes,
      dislikes: props.dislikes,
      hotness: props.likes.length - props.dislikes.length,
      isLike: false,
      isDislike: false
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
    let hotCount = 0;
    if (this.state.isLike) hotCount = -1;
    else if (this.state.isDislike) hotCount = 2;
    else hotCount = 1;

    // set thumb at front-end
    this.setState(prevState => ({
      isLike: !prevState.isLike,
      isDislike: false,
      hotness: prevState.hotness + hotCount
    }));

    // send request to back-end
    if (localStorage.jwtToken) {
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
      alert("Please log in first!");
    }
  };

  onPostDislike = () => {
    let hotCount = 0;
    if (this.state.isLike) hotCount = -2;
    else if (this.state.isDislike) hotCount = 1;
    else hotCount = -1;

    // set thumb at front-end
    this.setState(prevState => ({
      isLike: false,
      isDislike: !prevState.isDislike,
      hotness: prevState.hotness + hotCount
    }));

    // send request to back-end
    if (localStorage.jwtToken) {
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
      alert("Please log in first!");
    }
  };

  render() {
    return (
      <div className="text-center">
        <i
          className={classnames("far fa-thumbs-up mr-4", {
            "red-thumb": this.state.isLike,
            "red-thumb-animation": this.state.isLike,
            fas: this.state.isLike
          })}
          onClick={this.onPostLike}
        />
        <span className="hot-width">{this.state.hotness}</span>
        <i
          className={classnames("far fa-thumbs-down ml-4", {
            "blue-thumb": this.state.isDislike,
            "blue-thumb-animation": this.state.isDislike,
            fas: this.state.isDislike
          })}
          onClick={this.onPostDislike}
        />
      </div>
    );
  }
}
