import React from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";
import Unauthorized from "../utils/Unauthorized";
import Navbar from "../common/Navbar";
import SearchBar from "../common/SearchBar"

export default class Search extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        return (
          <div>
            <SearchBar />
          </div>
        )
    }
}