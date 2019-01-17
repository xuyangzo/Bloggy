const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostUpdateInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.text = !isEmpty(data.text) ? data.text : "";
  data.post_id = !isEmpty(data.post_id) ? data.post_id : "";

  // validating title
  if (Validator.isEmpty(data.title)) {
    errors.title = "Title cannot be empty";
  }
  // validating text
  if (Validator.isEmpty(data.text)) {
    errors.text = "Text cannot be empty";
  }
  // validating post_id
  if (Validator.isEmpty(data.post_id)) {
    errors.post_id = "Post ID cannot be empty";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
