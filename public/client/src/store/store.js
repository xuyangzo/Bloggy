import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import authReducer from "../reducers/authReducer";
import errorReducer from "../reducers/errorReducer";
import modalReducer from "../reducers/modalReducer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      errors: errorReducer,
      modal: modalReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );
  return store;
};
