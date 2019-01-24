import React from 'react';
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header class="masthead" style={{ backgroundImage: "url('./html/img/home-bg.jpg')" }}>
            <div class="overlay"></div>
            <div class="container">
                <div class="row">
                    <div class="col-lg-8 col-md-10 mx-auto">
                        <div class="site-heading">
                            <h1>Bloggy</h1>
                            <span class="subheading">Create your blog today</span>
                            <div class="col-lg-6 col-md-7 mx-auto text-center mt-4">
                                <Link className="nav-link" to="/register">
                                    <button type="button" class="btn btn-outline-light btn-block">Sign Up</button>
                                </Link>
                                <Link className="nav-link" to="/login">
                                    <button type="button" class="btn btn-outline-light btn-block">Login</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header >
    );
}

export default Header;