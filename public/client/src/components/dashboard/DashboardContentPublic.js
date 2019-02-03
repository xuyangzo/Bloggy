import React from "react";
import axios from "axios";
import Moment from "react-moment";
import InfiniteScroll from "react-infinite-scroller";
import "animate.css";


export default class DashboardContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allPosts: [],
            onClickPost: props.onClickPost,
            allRenderedPosts: [],
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
        return (
            <div className="dashboard-content">
                <div className="row">
                    <div className="col-md-8">
                        <div className="post-preview">
                            <h2 className="post-title">
                                Profile Name
                            <span className="ml-2">
                                    <button class="btn btn-outline-secondary my-2 my-sm-0" type="submit">
                                        Follow
                                </button>
                                </span>
                            </h2>
                            <h3 className="post-subtitle">
                                An open-source enthusiast, creator of @IssueHunt and @Boostnoteapp
                        </h3>
                            <p className="post-meta">Description</p>
                            <div className="row post-meta">
                                <div className="col">
                                    <p className="post-meta">1000 Following</p>
                                </div>
                                <div className="col">
                                    <p className="post-meta">1000 Followers</p>
                                </div>
                                <div className="col">
                                    <i class="fa fa-address-book" aria-hidden="true" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <img alt="Kazz Yokomizo"
                            src="https://miro.medium.com/fit/c/240/240/1*h8bl3llMMWGkoA242LHcDw.png"
                            class="rounded-circle"
                            width="120" height="120" />
                    </div>
                    <div className="col-12">
                        <nav class="navbar navbar-expand-sm navbar-light border-bottom border-info">
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <a class="nav-link active" href="#">Blogs</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">Favorites</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">Comments</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="col-12 mt-4">
                        <InfiniteScroll
                            pageStart={0}
                            loadMore={this.loadFunc}
                            hasMore={this.state.canLoad}
                            loader={
                                <div className="loader" key={0}>
                                    <div class="d-flex justify-content-center">
                                        <div class="spinner-border" role="status">
                                            <span class="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                            }
                        >
                            {this.state.allPosts.map(post => {
                                const temp = (
                                    <div className="col-md-12 featured-responsive" key={post._id}
                                        onClick={() => this.state.onClickPost(post._id)} style={{ cursor: "pointer" }}>
                                        <div className="featured-place-wrap">

                                            <div className="featured-title-box post-preview">
                                                <div className="row mb-2">
                                                    <div className="col-auto">
                                                        <img alt="Kazz Yokomizo"
                                                            src="https://miro.medium.com/fit/c/80/80/1*h8bl3llMMWGkoA242LHcDw.png"
                                                            class="rounded-circle" height="100%"
                                                        />
                                                    </div>
                                                    <div className="col-auto">
                                                        <ul>
                                                            <li>
                                                                <h5 className="custom">{post.author}</h5>
                                                            </li>
                                                            <li>
                                                                <p><Moment className="custom" format="MMMM Do YYYY, hh:mm a">{post.dateTime}</Moment></p>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                                <img src="https://cdn-images-1.medium.com/max/2000/1*GEwEeymxbjn7weKXGjq48Q.png"
                                                    className="img-fluid" alt="#" />
                                                <h3 className="custom post-title">{post.title}</h3>
                                                <h4 className="custom post-subtitle">{post.subtitle}</h4>
                                                <div className="bottom-icons">
                                                    <span className="fa fa-bookmark custom" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                                return temp;
                            })}
                        </InfiniteScroll>
                    </div>


                </div>
            </div>
        )
    }
}