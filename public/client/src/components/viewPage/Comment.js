import React from "react";
import Moment from "react-moment";
import axios from "axios";
import classnames from "classnames";
import scrollToElement from "scroll-to-element";

import LoginModal from "../common/LoginModal";
import setAuthToken from "../utils/setAuthToken";

export default class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allComments: props.allComments ? props.allComments : [],
      post_id: props.post_id,
      commentsNotReply: [],
      commentsIsReply: [],
      commentFormAppear: [],
      reRenderSignal: 0.0,
      displayComments: [],
      pageNumber: 1,
      totalPageNumber: 0,
      loginModal: false
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
            this.setState(
              prevState => ({
                commentsNotReply: [...prevState.commentsNotReply, comment]
              }),
              () => {
                // set total page number
                this.setState(prevState => ({
                  totalPageNumber:
                    Math.floor(prevState.commentsNotReply.length / 10) + 1
                }));
              }
            );
          }
        });
      }
    );
  };

  // switch page number
  onChangePage = pageNumber => {
    this.setState({ pageNumber });
    scrollToElement("#post-comment-form", {
      offset: 0,
      ease: "linear",
      duration: 100
    });
  };
  onBackPage = () => {
    this.setState(prevState => ({ pageNumber: prevState.pageNumber - 1 }));
    scrollToElement("#post-comment-form", {
      offset: 0,
      ease: "linear",
      duration: 100
    });
  };
  onForwardPage = () => {
    this.setState(prevState => ({ pageNumber: prevState.pageNumber + 1 }));
    scrollToElement("#post-comment-form", {
      offset: 0,
      ease: "linear",
      duration: 100
    });
  };

  // toggle comments
  toggleComments = comment_id => {
    // if already contains, remove
    if (this.state.displayComments.includes(comment_id)) {
      this.setState(prevState => ({
        displayComments: prevState.displayComments.filter(comment => {
          if (comment !== comment_id) return comment;
        })
      }));
    } else {
      // if do not exist, add to array
      this.setState(prevState => ({
        displayComments: [comment_id, ...prevState.displayComments]
      }));
    }
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

  // reply comments
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
                commentsNotReply: [...prevState.commentsNotReply, comment]
              }));
            }
          });
          // update toggle comments
          this.setState(prevState => ({
            commentFormAppear: prevState.commentFormAppear.filter(comment => {
              if (comment !== commid) return comment;
            }),
            displayComments: [commid, ...prevState.displayComments],
            totalPageNumber:
              Math.floor(prevState.commentsNotReply.length / 10) + 1
          }));
        })
        .catch(err => {
          console.log(err.response.data);
        });
    } else {
      this.setState({ loginModal: true });
    }
  };

  // cleat modal
  clearModal = () => {
    this.setState({ loginModal: false });
  };

  // construct pagination
  constructPagination = () => {
    var pagination = [];
    for (let i = 1; i < this.state.totalPageNumber + 1; i++) {
      const currentPage = (
        <li className="page-item" key={i}>
          <p
            className={classnames("page-link", {
              selected: this.state.pageNumber === i
            })}
            onClick={() => this.onChangePage(i)}
          >
            {i}
          </p>
        </li>
      );
      pagination.push(currentPage);
    }
    return pagination;
  };

  render() {
    return (
      <div id="comment-section">
        <LoginModal
          modalIsOpen={this.state.loginModal}
          clearModal={this.clearModal}
        />
        <p>COMMENTS</p>
        <hr />
        {this.state.commentsNotReply.length === 0 ? (
          <div>
            <p className="pale">No comments yet!</p>
            <p className="pale">Be the first one to comment!</p>
          </div>
        ) : (
          ""
        )}
        {this.state.commentsNotReply.map((comment, i) => {
          if (
            i >= this.state.pageNumber * 10 ||
            i < (this.state.pageNumber - 1) * 10
          )
            return "";
          return (
            <div
              className={classnames("container not-reply-comment", {
                "not-reply-comment-overwrite":
                  i + 1 === this.state.commentsNotReply.length ||
                  i + 1 === this.state.pageNumber * 10
              })}
              key={comment._id}
            >
              <div className="comment-top-half">
                <img
                  src={comment.avatar}
                  onClick={() =>
                    this.props.onGotoDashboard(comment.linked_comm_userid)
                  }
                />
                <p
                  className="username"
                  onClick={() =>
                    this.props.onGotoDashboard(comment.linked_comm_userid)
                  }
                >
                  {comment.username}
                </p>
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
              <p
                className="toggle-comment"
                onClick={() => this.toggleComments(comment._id)}
              >
                show comments &#40;{comment.beingReplied.length}&#41;
              </p>
              <div
                className={classnames("reply-container", {
                  "show-comment": this.state.displayComments.includes(
                    comment._id
                  )
                })}
              >
                {comment.beingReplied
                  .slice(0)
                  .reverse()
                  .map((reply, i) => {
                    const reply_temp = this.state.commentsIsReply.filter(
                      comment => {
                        if (comment._id === reply) return comment;
                      }
                    );
                    const reply_comment = reply_temp[0];
                    // if reply command id matchs this comment's id
                    return (
                      <div
                        className={classnames("container reply-comment", {
                          "reply-comment-overwrite":
                            i + 1 === comment.beingReplied.length
                        })}
                        key={reply_comment._id}
                      >
                        <div className="reply-top-half">
                          <img
                            src={reply_comment.avatar}
                            onClick={() =>
                              this.props.onGotoDashboard(
                                reply_comment.linked_comm_userid
                              )
                            }
                          />
                          <p
                            className="reply-username"
                            onClick={() =>
                              this.props.onGotoDashboard(
                                reply_comment.linked_comm_userid
                              )
                            }
                          >
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
                  })}
              </div>
            </div>
          );
        })}
        <div className="container text-center">
          <ul className="pagination text-center pagination-overwrite">
            {this.state.pageNumber === 1 ? (
              <li className="page-item invisible">
                <p className="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                  <span className="sr-only skyblue">Previous</span>
                </p>
              </li>
            ) : (
              <li className="page-item">
                <p
                  className="page-link"
                  aria-label="Previous"
                  onClick={this.onBackPage}
                >
                  <span aria-hidden="true">&laquo;</span>
                  <span className="sr-only skyblue">Previous</span>
                </p>
              </li>
            )}
            {this.constructPagination()}
            {this.state.pageNumber === this.state.totalPageNumber ||
            this.state.totalPageNumber === 0 ? (
              <li className="page-item invisible">
                <p className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                  <span className="sr-only">Next</span>
                </p>
              </li>
            ) : (
              <li className="page-item">
                <p
                  className="page-link"
                  aria-label="Next"
                  onClick={this.onForwardPage}
                >
                  <span aria-hidden="true">&raquo;</span>
                  <span className="sr-only">Next</span>
                </p>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}
