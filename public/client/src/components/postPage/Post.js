import React from "react";
import classnames from "classnames";
import axios from "axios";

import ReactQuill, { Quill } from "react-quill"; // Enable image resize
import ImageResize from "quill-image-resize-module";
Quill.register("modules/ImageResize", ImageResize);
import "react-quill/dist/quill.snow.css";

import setAuthToken from "../utils/setAuthToken";

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      subtitle: "",
      text: "",
      html: "",
      sources: [],
      expand: false
    };
  }

  // set HTML content
  handleChange = (value, delta, source, editor) => {
    this.setState({ text: value, html: editor.getHTML() });
  };

  // POST to backend
  onClick = e => {
    console.log(this.state.html);

    const singlePost = {
      title: this.state.title,
      subtitle: this.state.subtitle,
      text: this.state.html,
      sources: this.state.sources
    };

    if (localStorage.jwtToken) {
      setAuthToken(localStorage.jwtToken);
      axios
        .post("/api/posts/create", singlePost)
        .then(res => {
          console.log(res.data);
          location.href = "/view/" + res.data._id;
        })
        .catch(err => {
          this.setState({ errors: err.response.data });
          console.log(err.response.data);
        });
    } else {
      alert("Login expires");
      location.href = "/login";
    }
  };

  // update state
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // add source
  addSource = e => {
    if (document.getElementById("source-form").value.trim()) {
      this.setState(prevState => ({
        sources: prevState.sources.concat(
          document.getElementById("source-form").value.trim()
        )
      }));
    }
  };

  // expand/shrink animation for subtitle
  expand = e => {
    this.setState(prevState => ({ expand: !prevState.expand }));
  };

  render() {
    // setup react-quill
    const toolbarOptions = [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [
        { color: [] },
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "code-block"
      ],
      [{ list: "ordered" }, { list: "bullet" }],
      ["image", "link"]
    ];

    const modules = {
      toolbar: toolbarOptions,
      ImageResize: {
        modules: ["Resize", "DisplaySize", "Toolbar"]
      }
    };

    const formats = [
      "header",
      "font",
      "size",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "code-block",
      "list",
      "bullet",
      "link",
      "image",
      "color"
    ];

    return (
      <div className="container mt-5 whole-editor">
        <div className="col-md-10 m-auto">
          <br />
          <input
            type="text"
            className="form-control form-control-overwrite"
            placeholder="Title"
            name="title"
            onChange={this.onChange}
          />
          <i
            className={`fa title-icon ${
              this.state.expand ? "fa-minus-circle" : "fa-plus-circle"
            }`}
            onClick={this.expand}
          />
          <input
            type="text"
            className={classnames("form-control form-control-overwrite", {
              "subtitle-form-animation": this.state.expand
            })}
            id="subtitle-form"
            placeholder="Subtitle"
            name="subtitle"
            onChange={this.onChange}
          />
          <br />
          <br />
          <ReactQuill
            theme="snow"
            value={this.state.text}
            onChange={this.handleChange}
            modules={modules}
            formats={formats}
          />
          <br />
          <div className="source">
            <p>Sources:</p>
            <hr />
            {this.state.sources.map(source => {
              return (
                <div key={source}>
                  <p>{source}</p>
                </div>
              );
            })}
            <input
              type="text"
              className="form-control form-control-width"
              id="source-form"
              placeholder="Sources"
              name="sources"
            />
            <i
              className="fa fa-plus-circle source-icon"
              onClick={this.addSource}
            />
          </div>
          <br />
          <br />
          <br />
          <button
            className="btn btn-block btn-secondary"
            onClick={this.onClick}
          >
            Post!
          </button>
        </div>
      </div>
    );
  }
}
