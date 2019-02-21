const errorReducerDefaultState = {};

const errorReducer = (state = errorReducerDefaultState, action) => {
  switch (action.type) {
    case "SET_ERRORS":
      return action.errors;
    default:
      return state;
  }
};

export default errorReducer;
