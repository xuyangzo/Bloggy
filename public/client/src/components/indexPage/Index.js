import React from "react";

import Header from "./Header";
import LoginHeader from "./LoginHeader";
import IndexBody from "./IndexBody";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickPost = post_id => {
    this.props.history.push(`/view/${post_id}`);
  };

  render() {
    return (
      <div>
        {localStorage.jwtToken ? <LoginHeader /> : <Header />}
        <IndexBody onClickPost={this.onClickPost} />
      </div>
    );
  }
}
