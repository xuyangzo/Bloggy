import React from "react";
import { Link } from "react-router-dom";
import img from "./../../image/about-bg.jpg";

import "animate.css";

const Header = () => {
  return (
    <header
      id="header_image"
      className="masthead"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="overlay" />
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-10 mx-auto">
            <div className="site-heading animated fadeIn">
              <h1>Bloggy</h1>
              <span className="subheading">Create your blog today</span>
              <div className="col-lg-6 col-md-7 mx-auto text-center mt-4">
                <Link className="nav-link" to="/register">
                  <button
                    type="button"
                    className="btn btn-outline-light btn-block"
                  >
                    SIGN UP
                  </button>
                </Link>
                <Link className="nav-link" to="/login">
                  <button
                    type="button"
                    className="btn btn-outline-light btn-block"
                  >
                    LOGIN
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
