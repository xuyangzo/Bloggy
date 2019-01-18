const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // validating username
  if (Validator.isEmpty(data.username)) {
    errors.username = "Username cannot be empty";
  }
  // validating password
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password cannot be empty";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
