const models = require("../models/schedules");
const { connectRedis } = require("../middleware/redis");

const addSchedules = async (req, res) => {
  try {
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

    const roleValidator = req.users_id || null; // middleware for roleValidator
    const getRole = await models.getRoles({ roleValidator });
    const isAdmin = getRole[0]?.role;

    const getMovies = await models.getMoviesId({ movies_id });

    if (isAdmin == "ADMIN" && roleValidator == "1") {
      if (getMovies.length == 0) {
        throw { code: 400, message: "movies_id not identified" };
      }
      await models.addSchedules({
        users_id: roleValidator,
        movies_id,
        time,
        location,
        price,
        date_start,
        date_end,
        cinema,
      });

      res.status(201).json({
        status: "true",
        code: 201,
        message: "Success add new Schedules",
        data: { ...req.body },
      });
    } else {
      throw {
        code: 401,
        message: "Access not granted, only admin can access this section!",
      };
    }
  } catch (error) {
    res.status(error.code || 500).json({
      message: error.message,
    });
  }
};

const getSchedulesbyLocation = async (req, res) => {
  try {
    const { title } = req.params;
    const { page, limit, sort } = req.query;

    const totalDatas = await models.getAllSchedules();

    let getSchedulesData;
    let getAllData;

    if (title) {
      getSchedulesData = await models.getSchedulesByTitle({ title });
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
          message: `Get Schedules With Location: ${title}`,
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
        message: "Success get all data schedules",
        code: 200,
        total: getSchedulesData.length,
        data: getSchedulesData,
      });
    }
    if (page || limit || sort) {
      if (page && limit && sort) {
        getAllData = await models.getAllSchedulesPaginationSort({
          sort,
          limit,
          page,
        });
      } else if (page && limit) {
        getAllData = await models.getAllSchedulesPagination({ limit, page });
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("page", page, "ex", 10);
        connectRedis.set("limit", limit, "ex", 10);
        connectRedis.set("dataPerPage", JSON.stringify(getAllData), "ex", 10);
        connectRedis.set("getReqAccPagi", JSON.stringify(totalDatas), "ex", 10);
        connectRedis.set("isPaginated", true, "ex", 10);
      } else if (sort) {
        getAllData = await models.getAllSchedulesSort({ sort });
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
        message: "success get schedules",
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

const getSchedulesbyLocation2 = async (req, res) => {
  try {
    const { title } = req.params;
    const { page, limit, sort } = req.query;

    const totalDatas = await models.getAllSchedules2();

    let getSchedulesData;
    let getAllData;

    if (title) {
      getSchedulesData = await models.getSchedulesByTitle2({ title });
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
          message: `Get Schedules With Location: ${title}`,
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
        message: "Success get all data schedules",
        code: 200,
        total: getSchedulesData.length,
        data: getSchedulesData,
      });
    }
    if (page || limit || sort) {
      if (page && limit && sort) {
        getAllData = await models.getAllSchedulesPaginationSort2({
          sort,
          limit,
          page,
        });
      } else if (page && limit) {
        getAllData = await models.getAllSchedulesPagination2({ limit, page });
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("page", page, "ex", 10);
        connectRedis.set("limit", limit, "ex", 10);
        connectRedis.set("dataPerPage", JSON.stringify(getAllData), "ex", 10);
        connectRedis.set("getReqAccPagi", JSON.stringify(totalDatas), "ex", 10);
        connectRedis.set("isPaginated", true, "ex", 10);
      } else if (sort) {
        getAllData = await models.getAllSchedulesSort2({ sort });
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
        message: "success get schedules",
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

const updateSchedulesPartial = async (req, res) => {
  try {
    const { id } = req.params;
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

    const roleValidator = req.users_id || null; // middleware for roleValidator
    const getRole = await models.getRoles({ roleValidator });
    const isAdmin = getRole[0]?.role;

    if (isAdmin == "ADMIN" && roleValidator == "1") {
      const getAllData = await models.getSchedulesByID({ id });

      if (getAllData.length == 0) {
        throw { code: 400, message: "movies_id not identified" };
      } else {
        await models.updateSchedulesPartial({
          defaultValue: getAllData[0],
          users_id: roleValidator,
          movies_id,
          time,
          location,
          price,
          date_start,
          date_end,
          cinema,
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
    } else {
      throw {
        code: 401,
        message: "Access not granted, only admin can access this section!",
      };
    }
  } catch (error) {
    console.log(error);
    if (error.code !== 500) {
      if (
        error.message ==
        'duplicate key value violates unique constraint "movies_movie_name_key"'
      ) {
        res.status(422).json({
          message: "Movie with the provided movie_name already exists",
        });
      } else {
        res.status(error.code || 500).json({
          message: error.message ?? error,
        });
      }
    } else {
      res.status(error.code || 500).json({
        message: error.message,
      });
    }
  }
};

const deleteSchedules = async (req, res) => {
  try {
    const { id } = req.params;
    const getAllData = await models.getSchedulesByID({ id });

    const roleValidator = req.users_id || null; // middleware for roleValidator
    const getRole = await models.getRoles({ roleValidator });
    const isAdmin = getRole[0]?.role;

    if (isAdmin == "ADMIN" && roleValidator == "1") {
      if (getAllData.length == 0) {
        throw { code: 400, message: "movies_id not identified" };
      }

      await models.deleteSchedules({ id });
      res.json({
        status: "true",
        message: "MOVIE DELETED!",
      });
    } else {
      throw {
        code: 401,
        message: "Access not granted, only admin can access this section!",
      };
    }
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addSchedules,
  getSchedulesbyLocation,
  getSchedulesbyLocation2,
  updateSchedulesPartial,
  deleteSchedules,
};
