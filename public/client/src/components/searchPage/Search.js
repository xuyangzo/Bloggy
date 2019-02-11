import React from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";
import Unauthorized from "../utils/Unauthorized";
import Navbar from "../common/Navbar";
import SearchBar from "../common/SearchBar";

import Moment from "react-moment";
import InfiniteScroll from "react-infinite-scroller";
import Masonry from "react-masonry-component";

export default class Search extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            posts: []
        };
        const searchType = "all";
        const keyword =this.props.match.params.keyword;
        axios
            .get(`/api/search/${searchType}/${keyword}`)
            .then(res => {
                // console.log(res.data);
                this.setState(() => ({
                    posts: res.data.body
                }));
            })
            .catch(err => {
                this.setState({
                    errors: err.response.data
                });
                console.log(err.response.data);
            });
    }
    componentWillReceiveProps = newProps => {
        // console.log(newProps.match.params.post_id);
        const searchType = "all";
        const keyword = newProps.match.params.keyword;
        axios
            .get(`/api/search/${searchType}/${keyword}`)
            .then(res => {
                // console.log(res.data);
                this.setState(() => ({
                    posts: res.data.body
                }));
            })
            .catch(err => {
                this.setState({
                    errors: err.response.data
                });
                console.log(err.response.data);
            });
    };
    onClickPost = post_id => {
        this.props.history.push(`/view/${post_id}`);
        // console.log(post_id);
    };
    // loadFunc = () => {
    //     // if load before state initialize
    //     if (this.state.allPosts.length === 0) return;

    //     // retrieve following 3 posts info from database
    //     axios
    //         .get("/api/posts/index/" + this.state.renderCount)
    //         .then(res => {
    //             if (res.data.length === 0) {
    //                 this.setState({ canLoad: false });
    //                 return;
    //             }
    //             this.setState(prevState => ({
    //                 posts: prevState.allPosts.concat(res.data),
    //                 renderCount: prevState.renderCount + 3
    //             }));
    //         })
    //         .catch(err => console.log(err.response.data));
    // };
    render(){
        const masonryOptions = {
            transitionDuration: 0
        };
        return (
          <div>
            <div className="center">
                <SearchBar/>
                <form onSubmit={this.handleOnSubmit}>
                    Filter: 
                    <input type="radio" name="filter" value="author"/> Author
                    <input type="radio" name="filter" value="title"/> Title
                    <input type="radio" name="fitler" value="subtitle"/> Subtitle
                </form>
            </div>
            
                <div id="grid1">
                    <br />
                    <div className="col-lg-12 col-md-10 mx-auto center2">
                            <Masonry
                                elementType="div"
                                options={masonryOptions}
                                disableImagesLoaded={false}
                                updateOnEachImageLoad={false}
                                className="center2"
                            >
                                {this.state.posts.map(post => {
                                    const temp = (
                                        <div
                                            className="grid-item1 animated fadeInUp"
                                            key={post._id}
                                            onClick={() => this.onClickPost(post._id)}
                                            // onClick={() => this.state.onClickPost(post._id)}
                                        >
                                            <h1 className="grid-title">{post._source.title}</h1>
                                            <h4 className="grid-subtitle">{post._source.subtitle}</h4>
                                            <p className="grid-author">{post._source.author}</p>
                                            <Moment
                                                className="grid-time"
                                                format="MMMM Do YYYY, hh:mm a"
                                            >
                                                {post._source.dateTime}
                                            </Moment>
                                        </div>
                                    );
                                    return temp;
                                })}
                            </Masonry>
                    </div>
                    <br />
                    <br />
                </div>


          </div>
        )
    }
}