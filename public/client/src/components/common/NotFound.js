import React from "react";
import fof from "../../image/404.png";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="container text-center mt-5">
    <Link to="/" className="notfound-button mx-auto">
      BACK TO MAIN PAGE
    </Link>
    <br />
    <img src={fof} alt="404 not found" style={{ width: "70%" }} />
  </div>
);

export default NotFound;
