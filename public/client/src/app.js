import "bootstrap/dist/css/bootstrap.min.css";
import "../../html/css/clean-blog.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React from "react";
import ReactDOM from "react-dom";
import Bloggy from "./components/indexPage/Bloggy";
import "../../html/scss/clean-blog.scss";
import "../src/styles/style.scss";

ReactDOM.render(<Bloggy />, document.getElementById("app"));
