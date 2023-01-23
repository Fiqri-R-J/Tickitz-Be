const {
  Validator,
  addCustomMessages,
  extend,
} = require("node-input-validator");

const createMoviesValidator = (req, res, next) => {
  extend("regexDuration", () => {
    if (/^([0-9]+:)+[0-9]+$/.test(req.body.duration)) {
      return true;
    } else {
      return false;
    }
  });

  addCustomMessages({
    "duration.regexDuration": `Delimiter between hours to minutes, must be a colon (:)`,
    "movie_picture.required": `Missing files`,
  });

  const rules = new Validator(req.body, {
    users_id: "required",
    movie_name: "required|minLength:1|maxLength:50",
    category: "required|minLength:1|maxLength:100",
    director: "required|minLength:1|maxLength:100",
    casts: "required|minLength:1|maxLength:100",
    release_date: "required",
    synopsis: "required",
    movie_picture: req.body.movie_picture == "" ? "required|url" : "url",
    duration: "required|regexDuration",
  });

  rules.check().then((matched) => {
    if (matched) {
      next();
    } else {
      res.status(422).json({
        message: rules.errors,
      });
    }
  });
};

const updateMoviesPartialValidator = (req, res, next) => {
  const { email, phone_number, username, password, profile_picture } = req.body;

  extend("namePassswordValidator", () => {
    if (req.body.username !== req.body.password) {
      return true;
    }
    return false;
  });

  extend("regexUsername", () => {
    if (/^[a-zA-Z0-9\s+]+$/g.test(req.body.username)) {
      return true;
    } else {
      return false;
    }
  });

  extend("regexPass", () => {
    if (
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(
        req.body.password
      )
    ) {
      return true;
    } else {
      return false;
    }
  });

  addCustomMessages({
    "username.namePassswordValidator": `Password can't contain username`,
    "password.regexUsername": `Username can only contain Alphanumeric Characters`,
    "password.regexPass": `Passwords must have at least 8 characters and contain uppercase letters, lowercase letters, numbers, and symbols`,
  });

  const rules = new Validator(req.body, {
    email:
      email == ""
        ? "required|email|minLength:3|maxLength:100"
        : "email|minLength:3|maxLength:100",
    phone_number:
      phone_number == ""
        ? "required|phoneNumber|minLength:7|maxLength:14"
        : "phoneNumber|minLength:7|maxLength:12",
    username:
      username == ""
        ? "required|minLength:5|maxLength:25|regexUsername|namePassswordValidator"
        : "minLength:5|maxLength:25|regexUsername|namePassswordValidator",
    password:
      password == ""
        ? "required|regexPass|minLength:8|maxLength:20"
        : "regexPass|minLength:8|maxLength:20",
    profile_picture: profile_picture == "" ? "required|url" : "url",
  });

  rules.check().then((matched) => {
    if (matched) {
      next();
    } else {
      res.status(422).json({
        message: rules.errors,
      });
    }
  });
};

//   const deleteUsersValidator = (req, res, next) => {
//     const { id } = req.params;

//     const rules = new Validator(req.params, {
//       id: "required",
//     });

//     rules.check().then((matched) => {
//       if (matched) {
//         next();
//       } else {
//         res.status(422).json({
//           message: rules.errors,
//         });
//       }
//     });
//   };

module.exports = {
  createMoviesValidator,
  updateMoviesPartialValidator,
  // deleteUsersValidator,
};
