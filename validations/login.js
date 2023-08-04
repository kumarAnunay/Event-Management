const validateUserData = (data) => {
  const err = {
    hasError: false,
    message: "",
  };

  if (!data.email) {
    err.hasError = true;
    err.message = "Email is required";
  }

  if (!data.password) {
    err.hasError = true;
    err.message = "Password is required";
  }

  const userDetails = {
    name: data.name,
    email: data.email,
  };

  return err;
};

module.exports = validateUserData;
