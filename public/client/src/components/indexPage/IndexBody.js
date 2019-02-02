import React from "react";
import Masonry from "react-masonry-component";
import axios from "axios";
import Moment from "react-moment";
import InfiniteScroll from "react-infinite-scroller";

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allPosts: [],
      onClickPost: props.onClickPost,
      allRenderedPosts: [],
      renderCount: 0,
      canLoad: true
    };
    // retrieve post info from database
    axios
      .get("/api/posts/index")
      .then(res => {
        this.setState(prevState => ({
          allPosts: prevState.allPosts.concat(res.data)
        }));
      })
      .catch(err => console.log(err.response.data));
  }

  loadFunc = () => {
    // if load before state initialize
    if (this.state.allPosts.length === 0) return;
    // if run out of posts
    // if (this.state.renderCount === 12) {
    //   this.setState({ canLoad: false });
    //   return;
    // }

    console.log("load more!");

    // load 3 posts a time
    const newPosts = [];
    for (var i = this.state.renderCount; i < this.state.renderCount + 3; i++) {
      const post = this.state.allPosts[i];
      const temp = (
        <div
          className="grid-item"
          key={post._id}
          onClick={() => this.state.onClickPost(post._id)}
        >
          <h3>{post.title}</h3>
          <h4>{post.subtitle}</h4>
          <p>{post.author}</p>
          <Moment format="MMMM Do YYYY, hh:mm a">{post.dateTime}</Moment>
        </div>
      );
      newPosts.push(temp);
    }
    this.setState(prevState => ({
      allRenderedPosts: prevState.allRenderedPosts.concat(newPosts),
      renderCount: prevState.renderCount + 3
    }));
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
          <Masonry
            elementType="div"
            options={masonryOptions}
            disableImagesLoaded={false}
            updateOnEachImageLoad={false}
          >
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
              {this.state.allRenderedPosts}
            </InfiniteScroll>
          </Masonry>
        </div>
        <br />
        <br />
      </div>
    );
  }
}

export default Body;
