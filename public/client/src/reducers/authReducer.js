import _ from "lodash";

const authReducerDefaultState = { isAuthenticated: false, user: {} };

const authReducer = (state = authReducerDefaultState, action) => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return {
        ...state,
        isAuthenticated: !_.isEmpty(action.user),
        user: action.user
      };
    default:
      return state;
  }
};

export default authReducer;
