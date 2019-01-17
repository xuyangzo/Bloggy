const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostCreateInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.text = !isEmpty(data.text) ? data.text : "";

  // validating title
  if (Validator.isEmpty(data.title)) {
    errors.title = "Title cannot be empty";
  }
  // validating text
  if (Validator.isEmpty(data.text)) {
    errors.text = "Text cannot be empty";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
