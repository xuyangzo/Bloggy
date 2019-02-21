import setAuthToken from "../components/utils/setAuthToken";
import jwt_decode from "jwt-decode";
import axios from "axios";

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: "SET_CURRENT_USER",
    user: decoded
  };
};

// register user
export const registerUser = (userInfo, history) => dispatch => {
  // register user
  axios
    .post("/api/users/register", userInfo)
    .then(res => {
      console.log(res.data);
      history.push("/login");
    })
    .catch(err => {
      console.log(err.response.data);
      dispatch({
        type: "SET_ERRORS",
        errors: err.response.data
      });
    });
};

// log in user
export const loginUser = userInfo => dispatch => {
  // login user
  axios
    .post("/api/users/login", userInfo)
    .then(res => {
      console.log(res.data);
      // Save to localstorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err => {
      console.log(err.response.data);
      dispatch({
        type: "SET_ERRORS",
        errors: err.response.data
      });
      // this.setState({ errors: err.response.data });
      // console.log(err.response.data);
    });
};

// log in user and set modal to false
export const loginUserAndSetLoginModalFalse = (userInfo, dispatch) => {
  // login user
  axios
    .post("/api/users/login", userInfo)
    .then(res => {
      console.log(res.data);
      // Save to localstorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
      dispatch({
        type: "SET_LOGIN_MODAL",
        isOpen: false
      });
    })
    .catch(err => {
      console.log(err.response.data);
      dispatch({
        type: "SET_ERRORS",
        errors: err.response.data
      });
    });
};

// log out user
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future request
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
