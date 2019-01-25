const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostCreateInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  // validating text
  if (Validator.isEmpty(data.text)) {
    errors.text = "Text cannot be empty";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
