import React from "react";
import axios from "axios";
import Moment from "react-moment";

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post_id: props.match.params.post_id,
      title: "",
      subtitle: "",
      text: "",
      author: "",
      sources: "",
      dateTime: ""
    };
  }

  componentDidMount = () => {
    axios
      .get("/api/posts/view/" + this.state.post_id)
      .then(res => {
        console.log(res.data);
        this.setState({
          title: res.data.title,
          subtitle: res.data.subtitle,
          text: res.data.text,
          author: res.data.author,
          sources: res.data.sources,
          dateTime: res.data.dateTime
        });
      })
      .catch(err => {
        this.setState({ errors: err.response.data });
        console.log(err.response.data);
      });
  };

  createMarkup = () => {
    return { __html: this.state.text };
  };

  render() {
    return (
      <div>
        <div className="container text-center">
          <h1>{this.state.title}</h1>
          <p>{this.state.author}</p>
          <Moment>{this.state.dateTime}</Moment>
        </div>
        <div className="container col-md-8 m-auto single-post">
          <div dangerouslySetInnerHTML={this.createMarkup()} />
        </div>
      </div>
    );
  }
}
