import React from "react";
import Moment from "react-moment";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import classnames from "classnames";

export default class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allComments: props.allComments ? props.allComments : [],
      post_id: props.post_id,
      commentsNotReply: [],
      commentsIsReply: [],
      commentFormAppear: [],
      reRenderSignal: 0.0
    };
  }

  componentWillReceiveProps = newProps => {
    this.setState(
      {
        allComments: newProps.allComments,
        commentsIsReply: [],
        commentsNotReply: []
      },
      () => {
        // update reply/noreply status
        this.state.allComments.forEach(comment => {
          if (comment.reply_username) {
            // if the comment is a reply
            this.setState(prevState => ({
              commentsIsReply: [comment, ...prevState.commentsIsReply]
            }));
          } else {
            // if the comment is not a reply
            this.setState(prevState => ({
              commentsNotReply: prevState.commentsNotReply.concat(comment)
            }));
          }
        });
      }
    );
  };

  // control the appear/disappear of comment form
  addToAppear = commid => {
    // if already contains, remove
    if (this.state.commentFormAppear.includes(commid)) {
      this.setState(prevState => ({
        commentFormAppear: prevState.commentFormAppear.filter(comm => {
          if (comm !== commid) return comm;
        })
      }));
    } else {
      // if does not contain, add
      this.setState(prevState => ({
        commentFormAppear: [commid, ...prevState.commentFormAppear]
      }));
    }
  };

  onReply = (e, username, userid, commid) => {
    e.preventDefault();

    if (localStorage.jwtToken) {
      setAuthToken(localStorage.jwtToken);
      // reply comments
      const replyComment = {
        text: e.target.reply.value,
        reply_username: username,
        linked_reply_commid: commid
      };
      axios
        .post(
          `/api/posts/comment/${this.state.post_id}/${userid}`,
          replyComment
        )
        .then(res => {
          // update all comments
          this.setState({
            allComments: res.data.comments,
            commentsIsReply: [],
            commentsNotReply: []
          });
          // update comments that are replies
          this.state.allComments.forEach(comment => {
            if (comment.reply_username) {
              // if the comment is a reply
              this.setState(prevState => ({
                commentsIsReply: [comment, ...prevState.commentsIsReply]
              }));
            } else {
              // if the comment is not a reply
              this.setState(prevState => ({
                commentsNotReply: prevState.commentsNotReply.concat(comment)
              }));
            }
          });
        })
        .catch(err => {
          console.log(err.response.data);
          x;
        });
    } else {
      alert("Please login first!");
    }
  };

  render() {
    return (
      <div>
        <p>POPULAR COMMENTS</p>
        <hr />
        {this.state.commentsNotReply.map(comment => {
          return (
            <div className="container not-reply-comment" key={comment._id}>
              <div className="comment-top-half">
                <img src={comment.avatar} />
                <p className="username">{comment.username}</p>
                <Moment className="dateTime" format="YYYY-MM-DD, hh:mm a">
                  {comment.dateTime}
                </Moment>
              </div>
              <div className="comment-bottom-half">
                <p>{comment.text}</p>
              </div>
              <p
                className="btn comment-reply-button"
                onClick={() => this.addToAppear(comment._id)}
              >
                reply
              </p>
              <div>
                <form
                  className={classnames("comment-form", {
                    "comment-form-appear": this.state.commentFormAppear.includes(
                      comment._id
                    )
                  })}
                  onSubmit={e =>
                    this.onReply(
                      e,
                      comment.username,
                      comment.linked_comm_userid,
                      comment._id
                    )
                  }
                >
                  <input
                    type="text"
                    className="form-control comment-form-input"
                    name="reply"
                    placeholder="reply..."
                  />
                  <input
                    type="submit"
                    className="btn comment-form-submit"
                    value="comment"
                  />
                </form>
              </div>

              <div className="clear" />
              <div className="reply-container">
                {this.state.commentsIsReply.map(reply_comment => {
                  // if reply command id matchs this comment's id
                  if (reply_comment.linked_reply_commid === comment._id) {
                    return (
                      <div
                        class="container reply-comment"
                        key={reply_comment._id}
                      >
                        <div className="reply-top-half">
                          <img src={reply_comment.avatar} />
                          <p className="reply-username">
                            {reply_comment.username}
                          </p>
                          <Moment
                            className="dateTime"
                            format="YYYY-MM-DD, hh:mm a"
                          >
                            {reply_comment.dateTime}
                          </Moment>
                        </div>
                        <div className="reply-bottom-half pt-1">
                          <p>
                            Reply{" "}
                            <span className="username">
                              @{reply_comment.reply_username}
                            </span>
                            <br />
                            {reply_comment.text}
                          </p>
                        </div>
                        <p
                          className="btn comment-reply-button"
                          onClick={() => this.addToAppear(reply_comment._id)}
                        >
                          reply
                        </p>
                        <div>
                          <form
                            className={classnames("comment-form", {
                              "comment-form-appear": this.state.commentFormAppear.includes(
                                reply_comment._id
                              )
                            })}
                            onSubmit={e =>
                              this.onReply(
                                e,
                                reply_comment.username,
                                reply_comment.linked_comm_userid,
                                comment._id
                              )
                            }
                          >
                            <input
                              className="form-control comment-form-input"
                              type="text"
                              name="reply"
                              placeholder="reply..."
                            />
                            <input
                              type="submit"
                              className="btn comment-form-submit"
                              value="comment"
                            />
                          </form>
                        </div>
                        <div className="clear" />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
