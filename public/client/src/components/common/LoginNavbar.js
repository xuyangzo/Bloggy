import React from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import Headroom from "react-headroom";
import classnames from "classnames";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

class LoginNavbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: "",
      unpin: false,
      showInfoBoard: false,
      infoBoardStyle: {},
      username: "",
      description: ""
    };
  }
  onGotoSearch = e => {
    this.props.history.push(`/search/${e}`);
  };

  componentDidMount = e => {
    // retrieve avatar and userid
    if (localStorage.jwtToken) {
      setAuthToken(localStorage.jwtToken);
      axios
        .get("/api/users/current")
        .then(res => {
          // set info board style
          // const left =
          //   document.getElementById("profile-img").offsetLeft + 16 - 20;
          // const top =
          //   document.getElementById("profile-img").offsetTop + 16 + 25;
          // const right = window.innerWidth - left;

          // console.log("left: " + left);
          // console.log("right: " + right);
          // console.log("top: " + top);

          const infoBoardStyle = {
            top: "15px",
            right: "60px"
          };
          this.setState({ avatar: res.data.avatar, infoBoardStyle });
        })
        .catch(err => {
          console.log(err.response.data);
        });
    }
  };

  onLogoutUser = e => {
    e.preventDefault();
    this.props.dispatch(logoutUser());
  };

  onImgClick = e => {
    this.props.history.push("/dashboard");
    // this.setState({ showInfoBoard: false });
  };

  handleOnPin = e => {};

  handleOnUnpin = e => {
    this.setState({ unpin: true });
    // console.log("unpin");
  };

  // toggle info board
  toggleInfoBoard = () => {
    if (!this.state.showInfoBoard) {
      // send request to backend
      axios.get("/api/users/current").then(res => {
        this.setState(prevState => ({
          showInfoBoard: !prevState.showInfoBoard,
          username: res.data.username,
          description: res.data.description
        }));
      });
    } else {
      this.setState(prevState => {
        return { showInfoBoard: !prevState.showInfoBoard };
      });
    }
  };

  // set info board
  setInfoBoardOver = () => {
    this.setState({ showInfoBoard: true });
  };
  setInfoBoardLeave = () => {
    this.setState({ showInfoBoard: false });
  };

  // forward
  onGoto = url => {
    this.props.history.push(url);
    this.setInfoBoardLeave();
  };

  render() {
    const style = {
      transform: this.state.showInfoBoard
        ? `translate(-15px, 15px) scale(1.7) `
        : ""
    };

    return (
      <Headroom
        style={{
          WebkitTransition: "all .5s ease-in-out",
          MozTransition: "all .5s ease-in-out",
          OTransition: "all .5s ease-in-out",
          transition: "all .5s ease-in-out"
        }}
        onPin={this.handleOnPin}
        onUnpin={this.handleOnUnpin}
      >
        <nav className="navbar navbar-expand-md transparent" id="mainNav">
          <div className="container">
            <Link className="navbar-brand" to="/">
              Bloggy
            </Link>
            <button
              className="navbar-toggler navbar-toggler-right"
              type="button"
              data-toggle="collapse"
              data-target="#navbarResponsive"
              aria-controls="navbarResponsive"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="navbarResponsive">
              <div className="ml-auto">
                <SearchBar
                  initial={this.state.unpin}
                  onGotoSearch={this.onGotoSearch}
                />
              </div>
              <div
                className={classnames("info-board", {
                  "info-board-transition": this.state.showInfoBoard
                })}
                style={this.state.infoBoardStyle}
              >
                <div className="temp">
                  <div
                    className="info-board-content text-center"
                    onMouseEnter={this.setInfoBoardOver}
                    onMouseLeave={this.setInfoBoardLeave}
                  >
                    <h3 className="info-username pale">
                      {this.state.username}
                    </h3>
                    <p className="info-description pl-2 pr-2">
                      {this.state.description}
                    </p>
                    <hr style={{ width: "80%" }} />
                    <div className="info-bar">
                      <div
                        className="info-item"
                        onClick={() => this.onGoto("/dashboard")}
                      >
                        <i className="far fa-user info-icon mr-2" />
                        <Link to="/dashboard" onClick={this.setInfoBoardLeave}>
                          Profile
                        </Link>
                      </div>
                      <div className="info-item">
                        <i className="far fa-heart info-icon mr-2" />
                        <Link to="/">Favorite</Link>
                      </div>
                      <div className="info-item">
                        <i className="fas fa-cog info-icon mr-2" />
                        <Link to="/setting" onClick={this.setInfoBoardLeave}>
                          Setting
                        </Link>
                      </div>
                      <div className="info-item">
                        <i className="far fa-clock info-icon mr-2" />
                        <Link to="/">Timeline</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ul className="navbar-nav ml-auto">
                {/* <li className="nav-item mr-auto">
                
              </li> */}
                <li className="nav-item">
                  <img
                    className="profile-img"
                    id="profile-img"
                    alt="profile picture"
                    src={this.state.avatar}
                    onClick={this.onImgClick}
                    onMouseEnter={this.toggleInfoBoard}
                    onMouseLeave={this.toggleInfoBoard}
                    style={style}
                  />
                </li>

                <li>
                  <a
                    className="nav-link log-out"
                    href="#"
                    onClick={this.onLogoutUser}
                  >
                    Log Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </Headroom>
    );
  }
}

export default connect()(LoginNavbar);
