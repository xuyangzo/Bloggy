import React from "react";
import classnames from "classnames";
import axios from "axios";

import ReactQuill, { Quill } from "react-quill"; // Enable image resize
import ImageResize from "quill-image-resize-module";
Quill.register("modules/ImageResize", ImageResize);
import "react-quill/dist/quill.snow.css";

import setAuthToken from "../utils/setAuthToken";

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    const tagList = [""];
    this.state = {
      isEdit: this.props.location.isEdit || false,
      post_id: this.props.match.params.post_id
        ? this.props.match.params.post_id
        : "",
      title: this.props.location.title ? this.props.location.title : "",
      subtitle: this.props.location.subtitle
        ? this.props.location.subtitle
        : "",
      text: this.props.location.text ? this.props.location.text : "",
      html: this.props.location.text ? this.props.location.text : "",
      sources: this.props.location.sources ? this.props.location.sources : [],
      tags: [],
      expand: this.props.location.subtitle,
      errors: {}
    };
    console.log(this.state);
  }

  // set HTML content
  handleChange = (value, delta, source, editor) => {
    this.setState({ text: value, html: editor.getHTML() });
  };

  // POST to backend
  onClick = e => {
    const singlePost = {
      title: this.state.title,
      subtitle: this.state.subtitle,
      text: this.state.html,
      sources: this.state.sources
    };

    // if Edit
    if (this.state.isEdit) {
      if (localStorage.jwtToken) {
        setAuthToken(localStorage.jwtToken);
        axios
          .post(`/api/posts/edit/${this.state.post_id}`, singlePost)
          .then(res => {
            console.log(res.data);
            this.props.history.push(`/view/${res.data._id}`);
          })
          .catch(err => {
            this.setState({ errors: err.response.data });
            console.log(err.response.data);
          });
      } else {
        alert("Login expires");
        location.href = "/login";
      }
    } else {
      // if not Edit but Create
      if (localStorage.jwtToken) {
        setAuthToken(localStorage.jwtToken);
        axios
          .post("/api/posts/create", singlePost)
          .then(res => {
            console.log(res.data);
            this.props.history.push(`/view/${res.data._id}`);
          })
          .catch(err => {
            this.setState({ errors: err.response.data });
            console.log(err.response.data);
          });
      } else {
        alert("Login expires");
        location.href = "/login";
      }
    }
  };

  // update state
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // add source
  addSource = e => {
    if (document.getElementById("source-form").value.trim()) {
      if (
        !this.state.sources.includes(
          document.getElementById("source-form").value.trim()
        )
      ) {
        this.setState(prevState => ({
          sources: prevState.sources.concat(
            document.getElementById("source-form").value.trim()
          ),
          errors: {}
        }));
      } else {
        // add same source error
        this.setState({
          errors: { sameSource: "Cannot add the same source!" }
        });
      }
    } else {
      // add empty source error
      this.setState({
        errors: { emptySource: "Cannot add empty source!" }
      });
    }
  };

  // remove source
  removeSource = source => {
    this.setState(prevState => {
      const newSource = prevState.sources.filter(prev_source => {
        return prev_source !== source;
      });
      return {
        sources: newSource
      };
    });
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
        { align: ["", "center", "right"] },
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
      "color",
      "align"
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
            value={this.state.title}
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
            value={this.state.subtitle}
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
            placeholder="Your legend starts here..."
          />
          <br />
          <div className="source">
            <p>Sources:</p>
            <hr />
            {this.state.sources.map(source => {
              return (
                <div key={source} className="temp-row">
                  <p>{source}</p>
                  <i
                    className="fa fa-times-circle"
                    id={source}
                    onClick={() => this.removeSource(source)}
                  />
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
          <small className="text-danger">{this.state.errors.sameSource}</small>
          <small className="text-danger">{this.state.errors.emptySource}</small>
          <br />
          <br />
          <br />
          <button
            className="btn btn-block editor-button mb-5"
            onClick={this.onClick}
          >
            Post!
          </button>
        </div>
      </div>
    );
  }
}
