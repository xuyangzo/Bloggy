const modalReducerDefaultState = { isOpenLoginModal: false };

const modalReducer = (state = modalReducerDefaultState, action) => {
  switch (action.type) {
    case "SET_LOGIN_MODAL":
      return {
        isOpenLoginModal: action.isOpen
      };

    default:
      return state;
  }
};

export default modalReducer;
