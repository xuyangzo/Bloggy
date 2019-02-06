import React from "react";
import Modal from "react-modal";
import axios from "axios";

export default class DeleteModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: props.modalIsOpen,
      clearModal: props.clearModal,
      post_id: props.post_id
    };
  }

  componentDidMount = () => {
    Modal.setAppElement("#app");
  };

  componentWillReceiveProps = newProps => {
    this.setState({
      modalIsOpen: newProps.modalIsOpen,
      post_id: newProps.post_id
    });
  };

  /* react-modal lifecycle */
  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  closeModal = () => {
    this.setState({ modalIsOpen: false });
    this.state.clearModal();
  };

  // Delete Post
  onDeletePost = () => {
    setAuthToken(localStorage.jwtToken);
    axios
      .delete(`/api/posts/delete/${this.state.post_id}`)
      .then(res => {
        console.log(res.data);
        location.href = "/dashboard";
      })
      .catch(err => console.log(err.response.data));
  };

  render() {
    // custom styles
    const customStyles = {
      content: {
        top: "40%",
        left: "30%",
        right: "30%",
        bottom: "40%",
        background: "lightblue"
      }
    };

    // errors
    const { errors } = this.state;

    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Delete Modal"
        >
          <div className="container pl-2">
            <p>
              Once deleted, your post cannot be recovered! <br />
              <small style={{ color: "rgb(216, 112, 147)" }}>
                Click anywhere else to quit
              </small>
            </p>
            <button
              className="btn btn-light"
              style={{ marginLeft: "70%" }}
              onClick={this.onDeletePost}
            >
              Continue
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}
