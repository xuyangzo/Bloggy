import React from "react";

class TestNavbar extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick = e => {
    e.preventDefault();
    localStorage.removeItem("jwtToken");
    location.href = "/";
  };

  render() {
    return (
      <div>
        <h1>test navbar</h1>
        <button className="btn btn-primary" onClick={this.onClick}>
          Log out
        </button>
      </div>
    );
  }
}

export default TestNavbar;
