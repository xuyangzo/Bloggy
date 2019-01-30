import React from "react";
import Masonry from "react-masonry-component";
import axios from "axios";
import Moment from "react-moment";

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allPosts: [],
      onClickPost: props.onClickPost
    };
    // retrieve post info from database
    axios
      .get("/api/posts/all")
      .then(res => {
        this.setState(prevState => ({
          allPosts: prevState.allPosts.concat(res.data)
        }));
      })
      .catch(err => console.log(err.response.data));
  }

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
            {this.state.allPosts.map(post => {
              return (
                <div
                  className="grid-item"
                  key={post._id}
                  onClick={() => this.state.onClickPost(post._id)}
                >
                  <h3>{post.title}</h3>
                  <h4>{post.subtitle}</h4>
                  <p>{post.author}</p>
                  <Moment format="MMMM Do YYYY, hh:mm a">
                    {post.dateTime}
                  </Moment>
                </div>
              );
            })}
          </Masonry>
        </div>
        <br />
        <br />
      </div>
    );
  }
}

export default Body;
