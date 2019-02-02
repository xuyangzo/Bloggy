import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => (
  <div className="container text-center mt-5">
    <h1>You are unauthorized to access this page!</h1>
    <Link to="/login">Go to LOGIN</Link>
  </div>
);

export default Unauthorized;
