import React from "react";
import Header from "./Header";
import Body from "./Body";
import Form from "./Form.test";
import { BrowserRouter as Router } from "react-router-dom";

export default class Bloggy extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Header />
        <Body />
        <Form />
      </div>
    );
  }
}
