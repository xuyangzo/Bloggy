//Author: Zhixu Li
import React from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

export default class Follow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            follow:false
        };
        

        if (localStorage.jwtToken){
            
            axios.post("/api/users/check_follow/"+this.props.userid)
            .then(res=>{
                this.setState({
                    follow:res.data.follow
                });
            })

        }
    }



    onClick = e => {
        // console.log(1111111);
        // console.log("props " + this.props.userid);
        e.preventDefault();

        // send request to backend
        // setAuthToken(localStorage.jwtToken);
        if (this.state.follow == false) {
            axios.post("/api/users/follow/"+this.props.userid)
                .then(res => {
                    this.setState({
                       follow:true
                    })
                }
                )
                .catch(err => console.log(err));
        }else{
            axios.post("/api/users/unfollow/" + this.props.userid)
                .then(res => {
                    this.setState({
                        follow: false
                    })
                }
                )
                .catch(err => console.log(err));
        }
        
    };

    render() {
        return (
            <div>
                <button type="button" class="btn btn-outline-primary" onClick={this.onClick}>{this.state.follow ? "UnFollow":"Follow"}</button>
            </div>

        );
    }
}
