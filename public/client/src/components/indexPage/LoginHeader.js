import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header
      id="header_image"
      className="masthead"
      style={{ backgroundImage: "url('./client/src/image/about-bg.jpg')" }}
    >
      <div className="overlay" />
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-md-10 mx-auto">
            <div className="site-heading">
              <h1>Bloggy</h1>
              <span className="subheading">Create your blog today</span>
              <div className="col-lg-6 col-md-7 mx-auto text-center mt-4">
                <Link className="nav-link" to="/post">
                  <button
                    type="button"
                    className="btn btn-outline-light btn-block"
                  >
                    CREATE YOUR BLOG
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
