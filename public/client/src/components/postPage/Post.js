import React from "react";
import ReactQuill from "react-quill";

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }

  handleChange = value => {
    this.setState({ text: value });
  };

  render() {
    return (
      <div>
        <ReactQuill value={this.state.text} onChange={this.handleChange} />
      </div>
    );
  }
}
