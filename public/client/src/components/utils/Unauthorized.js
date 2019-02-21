import React from "react";
import { Link } from "react-router-dom";
import unauthorizedImg from "../../image/unauthorized.png";

const Unauthorized = () => (
  <div className="container text-center mt-5" style={{ minHeight: "65vh" }}>
    <div className="d-flex justify-content-around">
      <h1 className="shadow-font">Unauthorized!</h1>
      <Link to="/login" className="goto-login-button">
        GO TO LOGIN
      </Link>
    </div>
    <br />
    <img
      src={unauthorizedImg}
      alt="Unauthorized Image"
      style={{ width: "60%" }}
      className="mt-5 mb-5"
    />
  </div>
);

export default Unauthorized;
