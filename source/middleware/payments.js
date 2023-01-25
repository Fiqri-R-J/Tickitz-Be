const {
  Validator,
  addCustomMessages,
  extend,
} = require("node-input-validator");

const createPaymentsValidator = (req, res, next) => {
  extend("regexSeat", () => {
    if (/^([A-G][0-9]{1,2},)*[A-G][0-9]{1,2}$/.test(req.body.selected_seat)) {
      return true;
    } else {
      return false;
    }
  });

  addCustomMessages({
    "selected_seat.regexSeat": `Delimiter between seats must be a comma (,) & must be in Capital Letters`,
  });

  const rules = new Validator(req.body, {
    movies_id: "required",
    schedules_id: "required",
    payment_method: "required",
    selected_seat: "required|regexSeat",
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

const updatePaymentsPartialValidator = (req, res, next) => {
  const {
    users_id,
    movies_id,
    time,
    location,
    price,
    date_start,
    date_end,
    cinema,
    available_seat,
  } = req.body;

  extend("regexTime", () => {
    if (/^([0-9]+:)+[0-9]+$/.test(req.body.time)) {
      return true;
    } else {
      return false;
    }
  });

  extend("regexDateStart", () => {
    if (
      /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/.test(
        req.body.date_start
      )
    ) {
      return true;
    } else {
      return false;
    }
  });

  extend("regexDateEnd", () => {
    if (
      /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/.test(
        req.body.date_end
      )
    ) {
      return true;
    } else {
      return false;
    }
  });

  addCustomMessages({
    "time.regexTime": `Delimiter between hours to minutes, must be a colon (:)`,
    "date_start.regexDateStart": `Using ISO format (yyyy-mm-dd) is a mandatory`,
    "date_end.regexDateEnd": `Using ISO format (yyyy-mm-dd) is a mandatory`,
  });

  const rules = new Validator(req.body, {
    movies_id: movies_id ? "required" : "minLength:1",
    time: time ? "required|regexTime" : "regexTime",
    location: location ? "required" : "minLength:1",
    price: price ? "required" : "minLength:1",
    date_start: date_start ? "required|regexDateStart" : "regexDateStart",
    date_end: date_end ? "required|regexDateEnd" : "regexDateEnd",
    cinema: cinema ? "required" : "minLength:1",
    available_seat: available_seat ? "required" : "minLength:1",
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
  createPaymentsValidator,
  updatePaymentsPartialValidator,
};
