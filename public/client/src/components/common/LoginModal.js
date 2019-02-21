import React from "react";
import Modal from "react-modal";
import TextFieldGroup from "../common/TextFieldGroup";
import { connect } from "react-redux";
import { loginUserAndSetLoginModalFalse } from "../../actions/authActions";
import { setLoginModal } from "../../actions/modalActions";
import PropTypes from "prop-types";

class LoginModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }

  componentDidMount = () => {
    Modal.setAppElement("#app");
  };

  /* form operation */
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUserAndSetLoginModalFalse(user);
  };

  /* react-modal lifecycle */
  openModal = () => {
    this.setState({ modalIsOpen: true });
  };

  afterOpenModal = () => {};

  closeModal = () => {
    this.props.setLoginModal();
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
          isOpen={this.props.modal.isOpenLoginModal}
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

LoginModal.propTypes = {
  loginUserAndSetLoginModalFalse: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  modal: state.modal
});

const mapDispatchToProps = dispatch => ({
  setLoginModal: () => dispatch(setLoginModal(false)),
  loginUserAndSetLoginModalFalse: user => {
    loginUserAndSetLoginModalFalse(user, dispatch);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginModal);
