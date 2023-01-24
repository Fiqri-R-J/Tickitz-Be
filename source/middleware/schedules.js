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
  
    extend("regexReleaseDate", () => {
      if (
        /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/.test(
          req.body.release_date
        )
      ) {
        return true;
      } else {
        return false;
      }
    });
  
    addCustomMessages({
      "duration.regexDuration": `Delimiter between hours to minutes, must be a colon (:)`,
      "movie_picture.required": `Missing files`,
      "release_date.regexReleaseDate": `Using ISO format (yyyy-mm-dd) is a mandatory`,
    });
  
    const rules = new Validator(req.body, {
      users_id: "required",
      movie_name: "required|minLength:1|maxLength:50",
      category: "required|minLength:1|maxLength:100",
      director: "required|minLength:1|maxLength:100",
      casts: "required|minLength:1|maxLength:100",
      release_date: "required|regexReleaseDate",
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
    const {
      movie_name,
      category,
      director,
      casts,
      release_date,
      synopsis,
      movie_picture,
      duration,
    } = req.body;
  
    extend("regexDuration", () => {
      if (/^([0-9]+:)+[0-9]+$/.test(req.body.duration)) {
        return true;
      } else {
        return false;
      }
    });
  
    extend("regexReleaseDate", () => {
      if (
        /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/.test(
          req.body.release_date
        )
      ) {
        return true;
      } else {
        return false;
      }
    });
  
    addCustomMessages({
      "duration.regexDuration": `Delimiter between hours to minutes, must be a colon (:)`,
      "movie_picture.required": `Missing files`,
      "release_date.regexReleaseDate": `Using ISO format (yyyy-mm-dd) is a mandatory`,
    });
  
    const rules = new Validator(req.body, {
      movie_name: movie_name
        ? "required|minLength:1|maxLength:50"
        : "minLength:1|maxLength:50",
      category: category
        ? "required|minLength:1|maxLength:100"
        : "minLength:1|maxLength:100",
      director: director
        ? "required|minLength:1|maxLength:100"
        : "minLength:1|maxLength:100",
      casts: casts
        ? "required|minLength:1|maxLength:100"
        : "minLength:1|maxLength:100",
      release_date: release_date
        ? "required|regexReleaseDate"
        : "regexReleaseDate",
      synopsis: synopsis ? "required" : "minLength:1",
      movie_picture: req.body.movie_picture == "" ? "required|url" : "url",
      duration: duration ? "required|regexDuration" : "regexDuration",
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
  
  module.exports = {
    createMoviesValidator,
    updateMoviesPartialValidator,
  };
  