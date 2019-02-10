import React from "react";
import Modal from "react-modal";
import TextFieldGroup from "../common/TextFieldGroup";
import axios from "axios";

export default class LoginModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: props.modalIsOpen,
      clearModal: props.clearModal,
      email: "",
      password: "",
      errors: {}
    };
  }

  componentWillReceiveProps = newProps => {
    this.setState({ modalIsOpen: newProps.modalIsOpen });
  };

  componentDidMount = () => {
    Modal.setAppElement("#app");
  };

  /* form operation */
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const User = {
      email: this.state.email,
      password: this.state.password
    };

    axios
      .post("/api/users/login", User)
      .then(res => {
        console.log(res.data);
        // Save to localstorage
        const { token } = res.data;
        localStorage.setItem("jwtToken", token);
        // Reload
        window.location.reload();
      })
      .catch(err => {
        this.setState({ errors: err.response.data });
        console.log(err.response.data);
      });
  };

  /* react-modal lifecycle */
  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  afterOpenModal = () => {};

  closeModal = () => {
    this.setState({ modalIsOpen: false });
    this.state.clearModal();
  };

  render() {
    // custom styles
    const customStyles = {
      content: {
        top: "20%",
        left: "20%",
        right: "20%",
        bottom: "20%",
        background: "url('/client/src/image/city5.jpg')"
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
          contentLabel="Example Modal"
        >
          <div className="row mt-5">
            <div className="col-md-8 m-auto">
              <h3 className="display-4 text-center title-font mb-5">Log In</h3>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Email"
                  name="email"
                  id="email-field"
                  type="text"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                />
                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  id="password-field"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <input
                  className="form-control submit-button"
                  type="submit"
                  value="submit"
                />
              </form>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
