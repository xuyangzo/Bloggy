const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // validating email
  if (!Validator.isEmail(data.email)) {
    errors.email = "Please enter correct email address";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email cannot be empty";
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
