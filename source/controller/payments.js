const models = require("../models/payments");
const { connectRedis } = require("../middleware/redis");

const addPayments = async (req, res) => {
  try {
    const {
      users_id,
      movies_id,
      schedules_id,
      date_time,
      ticket_qty,
      total_payment,
      payment_method,
      selected_seat,
    } = req.body;

    const roleValidator = req.users_id || null; // middleware for roleValidator

    const getMovies = await models.getMoviesId({ movies_id });
    const getSchedules = await models.getSchedulesId({ schedules_id });

    if (getMovies.length == 0) {
      throw { code: 400, message: "movies_id not identified" };
    }
    if (getSchedules.length == 0) {
      throw { code: 400, message: "schedules_id not identified" };
    }
    const getPrice = parseInt(getSchedules[0]?.price);
    const getMovieTime = getSchedules[0]?.time;

    await models.addPayments({
      users_id: roleValidator,
      movies_id,
      schedules_id,
      date_time: getMovieTime,
      ticket_qty: selected_seat.split(",").length,
      total_payment: selected_seat.split(",").length * getPrice,
      payment_method,
      selected_seat,
    });

    const regex = /"|^\{|\}/g;
    const currentAvailableSeats = getSchedules[0].available_seat.replace(
      regex,
      ""
    );

    const selectedSeatArr = selected_seat.split(",");
    const updatedAvailableSeats = currentAvailableSeats
      .split(",")
      .filter((seat) => !selectedSeatArr.includes(seat))
      .join(",");

    // let error = null;
    // selectedSeatArr.some((seat) => {
    //   if (!currentAvailableSeats.includes(seat)) {
    //     error = `Seat ${seat} is already taken`;
    //     return true;
    //   }
    // });

    // console.log(selectedSeatArr);
    // console.log(currentAvailableSeats);

    // if (error) {
    //   throw {
    //     code: 400,
    //     message: `${error}, please choose another seat`,
    //   };
    // }
    // console.log(currentAvailableSeats);

    let taken = [];
    let temp = "";
    for (let i = 0; i < currentAvailableSeats.length; i++) {
      if (currentAvailableSeats[i] == ",") {
        taken.push(temp);
        temp = "";
      } else {
        temp = temp + currentAvailableSeats[i];
      }
    }
    // console.log(taken);

    let temps = [];
    for (let i = 0; i < taken.length; i++) {
      for (let j = 0; j < selectedSeatArr.length; j++) {
        if (taken[i] == selectedSeatArr[j]) {
          temps.push(taken[i]);
        }
      }
    }
    // console.log(temps);
    console.log(temps);
    console.log(selectedSeatArr);
    console.log(temps.length >= selectedSeatArr.length);
    if (temps.length !== selectedSeatArr.length) {
      throw {
        code: 400,
        message: `Seat ${selectedSeatArr.join(", ")} is not available`,
      };
    }

    // let takenSeats = [];
    // selectedSeatArr.forEach((seat) => {
    //   if (currentAvailableSeats.includes(seat)) {
    //     takenSeats.push(seat);
    //   }
    // });

    // if (takenSeats.length > 0) {
    //   throw {
    //     code: 400,
    //     message: `Seat ${takenSeats.join(", ")} is not available`,
    //   };
    // }

    await models.updateSchedulesSeat({
      available_seat: updatedAvailableSeats,
      id: schedules_id,
    });

    res.status(201).json({
      status: "true",
      code: 201,
      message: "Success add new Payments",
      data: { ...req.body },
    });
  } catch (error) {
    const statusCode =
      error.code &&
      typeof error.code === "number" &&
      error.code >= 100 &&
      error.code < 600
        ? error.code
        : 500;
    res.status(statusCode).json({
      message: error.message,
    });
  }
};

module.exports = { addPayments };
