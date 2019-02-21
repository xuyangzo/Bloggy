import React from "react";
import Masonry from "react-masonry-component";
import axios from "axios";
import Moment from "react-moment";
import InfiniteScroll from "react-infinite-scroller";

import "animate.css";

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allPosts: [],
      onClickPost: props.onClickPost,
      renderCount: 0,
      canLoad: true
    };
    // retrieve first 3 posts info from database
    axios
      .get("/api/posts/index/0")
      .then(res => {
        this.setState(prevState => ({
          allPosts: prevState.allPosts.concat(res.data),
          renderCount: 3
        }));
        // retrieve user profile image
      })
      .catch(err => console.log(err.response.data));
  }

  loadFunc = () => {
    // if load before state initialize
    if (this.state.allPosts.length === 0) return;

    // retrieve following 3 posts info from database
    axios
      .get("/api/posts/index/" + this.state.renderCount)
      .then(res => {
        if (res.data.length === 0) {
          this.setState({ canLoad: false });
          return;
        }
        this.setState(prevState => ({
          allPosts: prevState.allPosts.concat(res.data),
          renderCount: prevState.renderCount + 3
        }));
      })
      .catch(err => console.log(err.response.data));
  };

  render() {
    // masonry options
    const masonryOptions = {
      transitionDuration: 0
    };

    return (
      <div id="grid">
        <br />
        <div className="col-lg-12 col-md-10 mx-auto">
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadFunc}
            hasMore={this.state.canLoad}
            loader={
              <div className="loader" key={0}>
                Loading ...
              </div>
            }
          >
            <Masonry
              elementType="div"
              options={masonryOptions}
              disableImagesLoaded={false}
              updateOnEachImageLoad={false}
            >
              {this.state.allPosts.map(post => {
                const temp = (
                  <div
                    className="grid-item animated fadeInUp"
                    key={post._id}
                    onClick={() => this.state.onClickPost(post._id)}
                  >
                    <h1 className="grid-title">{post.title}</h1>
                    <h4 className="grid-subtitle">{post.subtitle}</h4>

                    <Moment
                      className="grid-time"
                      format="MMMM Do YYYY, hh:mm a"
                    >
                      {post.dateTime}
                    </Moment>
                    <br />

                    <p className="grid-author">{post.author}</p>
                  </div>
                );
                return temp;
              })}
            </Masonry>
          </InfiniteScroll>
        </div>
        <br />
        <br />
      </div>
    );
  }
}

export default Body;
