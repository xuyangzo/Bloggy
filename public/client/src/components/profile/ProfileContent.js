import React from "react";
import axios from "axios";
import Moment from "react-moment";
import InfiniteScroll from "react-infinite-scroller";
import "animate.css";


export default class ProfileContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postList: [],
            allPosts: [],
            onClickPost: props.onClickPost,
            allRenderedPosts: [],
            renderCount: -1,
            canLoad: true,
            navName: "Blogs"
        };

        // Retrieve post list
        axios.get("/api/users/" + this.props.userid)
            .then(res => {
                const postList = res.data.posts.reverse();
                this.setState({
                    postList: postList,
                    username: res.data.username,
                    avatar: res.data.avatar,
                    description: 
                        ('description' in res.data) ? res.data.description
                        : res.data.username+" has nothing to say...",
                    favorites: res.data.favorites,
                    following: res.data.following.length,
                    followers: res.data.beingFollowed.length,
                    renderCount: 0
                })}
            )
            .catch(err => console.log(err));
    }

    loadFunc = () => {
        // if load before state initialize
        if (this.state.renderCount === -1) return;

        // Posts left
        const currRender = this.state.renderCount;
        const postLength = this.state.postList.length
        const postLeft = postLength - currRender;
        console.log(`PostsLeft: ${postLeft}`);

        if (this.state.navName=="Blogs") {
            if (postLeft<3) {
                this.setState({
                    canLoad: false
                }, () => {
                    // Load the rest of the posts if more than 0 left
                    if (postLeft!=0) { 
                        const postString = this.state.postList.slice(
                            currRender, currRender+postLeft
                        ).join(',');
                        const postObj = {
                            posts: postString
                        };
                        axios.post("/api/posts/certain", postObj)
                        .then(res => {
                            this.setState(prevState => ({
                                allPosts: prevState.allPosts.concat(res.data.reverse()),
                                renderCount: this.state.postList.length,
                                canLoad: false
                            }));
                        })
                        .catch(err => {
                            console.log(err.response.data);
                        });
                    }
                })
            } else {
                // Load next 3 posts
                const postString = this.state.postList.slice(
                    currRender, currRender+3
                ).join(',');
                const postObj = {
                    posts: postString
                };
                console.log(postString);
                axios.post("/api/posts/certain", postObj)
                .then(res => {
                    this.setState(prevState => ({
                        allPosts: prevState.allPosts.concat(res.data.reverse()),
                        renderCount: this.state.renderCount+3
                    }));
                })
                .catch(err => {
                    console.log(err.response.data);
                });
            }
        }
        else if (this.state.navName=="Favorites") {
            if (postLeft<3) {
                this.setState({
                    canLoad: false
                }, () => {
                    // Load the rest of the posts if more than 0 left
                    if (postLeft!=0) { 
                        const postString = this.state.postList.slice(
                            currRender, currRender+postLeft
                        ).join(',');
                        const postObj = {
                            posts: postString
                        };
                        axios.post("/api/posts/certain", postObj)
                        .then(res => {
                            this.setState(prevState => ({
                                allPosts: prevState.allPosts.concat(res.data),
                                renderCount: this.state.postList.length,
                                canLoad: false
                            }));
                        })
                        .catch(err => {
                            console.log(err.response.data);
                        });
                    }
                })
            } else {
                // Load next 3 posts
                const postString = this.state.postList.slice(
                    currRender, currRender+3
                ).join(',');
                const postObj = {
                    posts: postString
                };
                console.log(postString);
                axios.post("/api/posts/certain", postObj)
                .then(res => {
                    this.setState(prevState => ({
                        allPosts: prevState.allPosts.concat(res.data),
                        renderCount: this.state.renderCount+3
                    }));
                })
                .catch(err => {
                    console.log(err.response.data);
                });
            }
        }
    }

    handleNavClick = (navName) => {
        this.setState({
            postList: [],
            allPosts: [],
            allRenderedPosts: [],
            renderCount: -1,
            canLoad: true,
            navName: navName
        }, () => {
            if (navName=="Blogs") {
                axios.get("/api/users/" + this.props.userid)
                .then(res => {
                    const postList = res.data.posts.reverse();
                    this.setState({
                        postList: postList,
                        renderCount: 0
                    })}
                )
                .catch(err => console.log(err));
            }
            else if (navName=="Favorites") {
                axios.get("/api/users/" + this.props.userid)
                .then(res => {
                    const postList = res.data.favorites
                    .map(obj => obj._id);
                    this.setState({
                        postList: postList,
                        renderCount: 0
                    })
                })
                .catch(err => console.log(err));
            }
        })
    }

    render() {
        return (
            <div className="dashboard-content">
                <div className="row">
                    <div className="col-md-8">
                        <div className="post-preview">
                            <h2 className="post-title">
                                {this.state.username}
                                <span className="ml-2">
                                    <button class="btn btn-outline-secondary my-2 my-sm-0" type="submit">
                                        Follow
                                    </button>
                                </span>
                            </h2>
                            <h4 className="post-subtitle">
                                {this.state.description}
                            </h4>
                            <div className="row post-meta">
                                <div className="col">
                                    <p className="post-meta">{this.state.following} Following</p>
                                </div>
                                <div className="col">
                                    <p className="post-meta">{this.state.followers} Followers</p>
                                </div>
                                <div className="col">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <img alt={this.state.username}
                            src={this.state.avatar}
                            class="rounded-circle"
                            width="120" height="120" />
                    </div>
                    <div className="col-12">
                        <nav className="navbar navbar-expand-sm navbar-light border-bottom border-info">
                            <ul className="navbar-nav">
                                <li className="nav-item" style={{ cursor: "pointer" }}>
                                    <a 
                                        className={
                                            this.state.navName=="Blogs" ? 
                                            "nav-link active" : "nav-link"
                                        }
                                        onClick={
                                            () => this.handleNavClick("Blogs")
                                        }
                                    >
                                        Blogs
                                    </a>
                                </li>
                                <li class="nav-item" style={{ cursor: "pointer" }}>
                                    <a 
                                        class={
                                            this.state.navName=="Favorites" ? 
                                            "nav-link active" : "nav-link"
                                        }
                                        onClick={
                                            () => this.handleNavClick("Favorites")
                                        }
                                    >
                                        Favorites
                                    </a>
                                </li>
                                <li class="nav-item" style={{ cursor: "pointer" }}>
                                    <a 
                                        class={
                                            this.state.navName=="Comments" ? 
                                            "nav-link active" : "nav-link"
                                        }
                                        onClick={
                                            () => this.handleNavClick("Comments")
                                        }
                                    >
                                        Comments
                                    </a>
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
                                                        <img alt={this.state.username}
                                                            src={this.state.avatar}
                                                            class="rounded-circle"
                                                            width="70" height="70"
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
                                                    {/* <span className="fa fa-bookmark custom" /> */}
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