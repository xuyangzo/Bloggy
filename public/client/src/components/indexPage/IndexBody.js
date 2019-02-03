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
            renderCount: 0,
            canLoad: true
        };
        // retrieve first 6 posts info from database
        axios
            .get("/api/posts/index/0")
            .then(res => {
                console.log(res.data);
                this.setState(prevState => ({
                    allPosts: prevState.allPosts.concat(res.data),
                    renderCount: 6
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

        // retrieve following 6 posts info from database
        axios
            .get("/api/posts/index/" + this.state.renderCount)
            .then(res => {
                if (!res.data || !!res.data) {
                    this.setState({ canLoad: false });
                }
                this.setState(prevState => ({
                    allPosts: prevState.allPosts.concat(res.data),
                    renderCount: prevState.renderCount + 6
                }));
            })
            .catch(err => console.log(err.response.data));

        console.log("load more!");
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