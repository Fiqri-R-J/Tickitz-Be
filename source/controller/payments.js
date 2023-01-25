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

    //for filtering available_seat based on selected_seat
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

    //for the message result
    //convert to array use for loop, bcs data from query is string
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

    let temps = [];
    for (let i = 0; i < taken.length; i++) {
      for (let j = 0; j < selectedSeatArr.length; j++) {
        if (taken[i] == selectedSeatArr[j]) {
          temps.push(taken[i]);
        }
      }
    }

    let filteredArray = selectedSeatArr.filter((item) => !temps.includes(item));

    if (temps.length !== selectedSeatArr.length) {
      throw {
        code: 400,
        message: `Seat ${filteredArray.join(
          ", "
        )} is already taken, please choose another seats`,
      };
    }
    //end of --- for the message result
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

const getPayments = async (req, res) => {
  try {
    const { title } = req.params;
    const { page, limit, sort } = req.query;

    const totalDatas = await models.getPayments();

    let getSchedulesData;
    let getAllData;

    if (title) {
      getSchedulesData = await models.getPaymentsbyId({ title });
      connectRedis.set("find_schedules", true, "ex", 10);
      connectRedis.set("url", req.originalUrl, "ex", 10);
      connectRedis.set("location", title, "ex", 10);
      connectRedis.set(
        "getReqSchedules",
        JSON.stringify(getSchedulesData),
        "ex",
        10
      );
      if (getSchedulesData && getSchedulesData.length > 0) {
        res.json({
          message: `Get Payments detail With payments_id: ${title}`,
          code: 200,
          data: getSchedulesData,
        });
      } else {
        throw { code: 422, message: "Data not found" };
      }
    }
    if (!title && !page && !limit && !sort) {
      getSchedulesData = totalDatas;
      connectRedis.set("url", req.originalUrl, "ex", 10);
      connectRedis.set("find_all_schedules", true, "ex", 10);
      connectRedis.set(
        "getReqSchedules",
        JSON.stringify(getSchedulesData),
        "ex",
        10
      );
      res.json({
        message: "Success get all Payments detail",
        code: 200,
        total: getSchedulesData.length,
        data: getSchedulesData,
      });
    }
    if (page || limit || sort) {
      if (page && limit && sort) {
        getAllData = await models.getAllPaymentsPaginationSort({
          sort,
          limit,
          page,
        });
      } else if (page && limit) {
        getAllData = await models.getAllPaymentsPagination({ limit, page });
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("page", page, "ex", 10);
        connectRedis.set("limit", limit, "ex", 10);
        connectRedis.set("dataPerPage", JSON.stringify(getAllData), "ex", 10);
        connectRedis.set("getReqAccPagi", JSON.stringify(totalDatas), "ex", 10);
        connectRedis.set("isPaginated", true, "ex", 10);
      } else if (sort) {
        getAllData = await models.getAllPaymentsSort({ sort });
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("isSorted", true, "ex", 10);
        connectRedis.set("sortedData", JSON.stringify(getAllData), "ex", 10);
        res.json({
          message: "Success get all schedules",
          total: getAllData.length,
          data: getAllData,
        });
      }
    }

    if ((page && limit && sort) || (page && limit)) {
      connectRedis.set("url", req.originalUrl, "ex", 10);
      connectRedis.set("page", page, "ex", 10);
      connectRedis.set("limit", limit, "ex", 10);
      connectRedis.set("dataPerPage", JSON.stringify(getAllData), "ex", 10);
      connectRedis.set("getReqAccPagi", JSON.stringify(totalDatas), "ex", 10);
      connectRedis.set("isPaginated", true, "ex", 10);
      res.json({
        message: "success get Payments detail",
        code: 200,
        total: totalDatas.length,
        dataPerPage: getAllData.length,
        page: `${page} from ${Math.ceil(totalDatas.length / limit)}`,
        data: getAllData,
      });
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      serverMessage: error,
      data: [],
    });
  }
};

const updatePayments = async (req, res) => {
  try {
    const { id } = req.params;
    const { ticket_status } = req.body;

    const roleValidator = req.users_id || null;
    const getRole = await models.getRoles({ roleValidator });
    const isAdmin = getRole[0]?.role;

    const getAllData = await models.getPaymentsbyIds({ id });
    console.log(getAllData);
    if (getAllData.length == 0) {
      throw { code: 400, message: "payments_id not identified" };
    } else {
      await models.updatePaymentsPartial({
        ticket_status,
        id,
      });

      res.json({
        status: "true",
        message: "data updated",
        data: {
          id,
          ...req.body,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).json({
      message: error.message || error,
    });
  }
};

module.exports = { addPayments, getPayments, updatePayments };
