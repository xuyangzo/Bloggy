import React from "react";
import classnames from "classnames";
import axios from "axios";
import uuid from "uuid";

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
      images: this.props.location.images ? this.props.location.images : [],
      errors: {},
      editor: {}
    };
    console.log(this.state);
  }

  // set HTML content
  handleChange = (value, delta, source, editor) => {
    const contents = editor.getContents().ops;
    // check if any image gets deleted
    for (let i = 0; i < this.state.images.length; i++) {
      var find = [false];
      const image = this.state.images[i];
      for (let j = 0; j < contents.length; j++) {
        const content = contents[j];
        if (content.insert.image === image.url) {
          find[0] = true;
        }
      }
      if (!find[0]) {
        // send request to backend to delete image
        console.log(image.imageid);
        axios
          .post(`/api/posts/removeimage/${image.imageid}`)
          .then(res => {
            console.log(res.data);
            // remove it from array
            this.setState(prevState => ({
              images: prevState.images.filter(new_image => {
                if (new_image.imageid != image.imageid) return new_image;
              })
            }));
          })
          .catch(err => console.log(err));
      }
    }

    editor.getContents().ops.forEach(op => {
      if (op.insert.hasOwnProperty("image")) {
        if (
          this.state.images.filter(image => {
            if (image.url === op.insert.image) {
              return op;
            }
          }).length !== this.state.images.length
        ) {
        }
      }
    });

    this.setState({ text: value, editor });
  };

  // POST to backend
  onClick = e => {
    if (localStorage.jwtToken) {
      const singlePost = {
        title: this.state.title,
        subtitle: this.state.subtitle,
        text: this.state.editor.getHTML(),
        sources: this.state.sources,
        images: this.state.images
      };
      // if Edit
      if (this.state.isEdit) {
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
        // if create
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
      }
    } else {
      // if user not logged in
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

  // custom handler for image
  imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.setAttribute("name", uuid());
    input.click();

    input.onchange = async () => {
      const quill = this.reactQuillRef.getEditor();
      const file = input.files[0];
      let data = new FormData();
      data.append("file", file);

      // Save current cursor state
      const range = quill.getSelection(true);

      // send request to backend to upload image
      setAuthToken(localStorage.jwtToken);
      axios
        .post("/api/posts/upload/file", data, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          console.log(res.data);
          quill.insertEmbed(range.index, "image", res.data.url);
          this.setState(
            prevState => ({
              images: [
                ...prevState.images,
                { url: res.data.url, imageid: res.data.imageid }
              ]
            }),
            () => {
              quill.setSelection(range.index + 1);
            }
          );
        })
        .catch(err => console.log(err));
    };
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
      toolbar: {
        container: toolbarOptions,
        handlers: {
          image: this.imageHandler
        }
      },
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
            ref={el => {
              this.reactQuillRef = el;
            }}
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
