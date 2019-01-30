import React from "react";
import { Link } from "react-router-dom";

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <footer className="page-footer font-small pt-4">
          <div className="container-fluid text-center text-md-left">
            <div className="row">
              <div className="col-md-6 ml-5 mt-md-0 mt-3">
                <h5 className="text-uppercase">Welcome to Bloggy!</h5>
                <p>
                  Bloggy is a custom blog engine that allows users to
                  view/post/edit/comment/like/share/delete their posts
                </p>
              </div>

              <hr className="clearfix w-100 d-md-none pb-3" />

              <div className="col-md-3 ml-5 mb-md-0 mb-3">
                <h5 className="text-uppercase">Links</h5>

                <ul className="list-unstyled">
                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/post">Create Post</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="footer-copyright text-center py-3">
              © 2018 Copyright:
              <Link to="/"> Bloggy Develop Team</Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}
