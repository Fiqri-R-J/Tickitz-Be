const db = require("../config/database");
const models = require("../models/movies");
const { v4: uuidv4 } = require("uuid");
const { connectRedis } = require("../middleware/redis");
const { cloudinary } = require("../middleware/upload");

const getMoviesJoin = async (req, res) => {
  try {
    const { title } = req.params;
    const { page, limit, sort } = req.query;

    const totalDatas = await models.getAllMoviesJoin();

    let getMoviesData;
    let getAllData;

    if (title) {
      getMoviesData = await models.getMoviesByTitleJoin({ title });
      connectRedis.set("find_movies", true, "ex", 10);
      connectRedis.set("url", req.originalUrl, "ex", 10);
      connectRedis.set("movie_name", title, "ex", 10);
      connectRedis.set("getReqMovies", JSON.stringify(getMoviesData), "ex", 10);
      if (getMoviesData && getMoviesData.length > 0) {
        res.json({
          message: `Get Movie With Title: ${title}`,
          code: 200,
          data: getMoviesData,
        });
      } else {
        throw { code: 422, message: "Data not found" };
      }
    }
    if (!title && !page && !limit && !sort) {
      getMoviesData = totalDatas;
      connectRedis.set("url", req.originalUrl, "ex", 10);
      connectRedis.set("find_all_movies", true, "ex", 10);
      connectRedis.set("getReqMovies", JSON.stringify(getMoviesData), "ex", 10);
      res.json({
        message: "Success get all data movies",
        code: 200,
        total: getMoviesData.length,
        data: getMoviesData,
      });
    }
    if (page || limit || sort) {
      if (page && limit && sort) {
        getAllData = await models.getAllMoviesPaginationSortJoin({
          sort,
          limit,
          page,
        });
      } else if (page && limit) {
        getAllData = await models.getAllMoviesPaginationJoin({ limit, page });
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("page", page, "ex", 10);
        connectRedis.set("limit", limit, "ex", 10);
        connectRedis.set("dataPerPage", JSON.stringify(getAllData), "ex", 10);
        connectRedis.set("getReqAccPagi", JSON.stringify(totalDatas), "ex", 10);
        connectRedis.set("isPaginated", true, "ex", 10);
      } else if (sort) {
        getAllData = await models.getAllMoviesSortJoin({ sort });
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("isSorted", true, "ex", 10);
        connectRedis.set("sortedData", JSON.stringify(getAllData), "ex", 10);
        res.json({
          message: "Success get all movies",
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
        message: "success get movies",
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

const getMoviesbyTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const { page, limit, sort } = req.query;

    const totalDatas = await models.getAllMovies();

    let getMoviesData;
    let getAllData;

    if (title) {
      getMoviesData = await models.getMoviesByTitle({ title });
      connectRedis.set("find_movies", true, "ex", 10);
      connectRedis.set("url", req.originalUrl, "ex", 10);
      connectRedis.set("movie_name", title, "ex", 10);
      connectRedis.set("getReqMovies", JSON.stringify(getMoviesData), "ex", 10);
      if (getMoviesData && getMoviesData.length > 0) {
        res.json({
          message: `Get Movie With Title: ${title}`,
          code: 200,
          data: getMoviesData,
        });
      } else {
        throw { code: 422, message: "Data not found" };
      }
    }
    if (!title && !page && !limit && !sort) {
      getMoviesData = totalDatas;
      connectRedis.set("url", req.originalUrl, "ex", 10);
      connectRedis.set("find_all_movies", true, "ex", 10);
      connectRedis.set("getReqMovies", JSON.stringify(getMoviesData), "ex", 10);
      res.json({
        message: "Success get all data movies",
        code: 200,
        total: getMoviesData.length,
        data: getMoviesData,
      });
    }
    if (page || limit || sort) {
      if (page && limit && sort) {
        getAllData = await models.getAllMoviesPaginationSort({
          sort,
          limit,
          page,
        });
      } else if (page && limit) {
        getAllData = await models.getAllMoviesPagination({ limit, page });
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("page", page, "ex", 10);
        connectRedis.set("limit", limit, "ex", 10);
        connectRedis.set("dataPerPage", JSON.stringify(getAllData), "ex", 10);
        connectRedis.set("getReqAccPagi", JSON.stringify(totalDatas), "ex", 10);
        connectRedis.set("isPaginated", true, "ex", 10);
      } else if (sort) {
        getAllData = await models.getAllMoviesSort({ sort });
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("isSorted", true, "ex", 10);
        connectRedis.set("sortedData", JSON.stringify(getAllData), "ex", 10);
        res.json({
          message: "Success get all movies",
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
        message: "success get movies",
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

const getMoviesbyTitle2 = async (req, res) => {
  try {
    const { title } = req.params;
    const { page, limit, sort } = req.query;

    const totalDatas = await models.getAllMovies();

    let getMoviesData;
    let getAllData;

    if (title) {
      getMoviesData = await models.getMoviesByTitle({ title });
      connectRedis.set("find_movies", true, "ex", 10);
      connectRedis.set("url", req.originalUrl, "ex", 10);
      connectRedis.set("movie_name", title, "ex", 10);
      connectRedis.set("getReqMovies", JSON.stringify(getMoviesData), "ex", 10);
      if (getMoviesData && getMoviesData.length > 0) {
        res.json({
          message: `Get Movie With Title: ${title}`,
          code: 200,
          data: getMoviesData,
        });
      } else {
        throw { code: 422, message: "Data not found" };
      }
    }
    if (!title && !page && !limit && !sort) {
      getMoviesData = totalDatas;
      connectRedis.set("url", req.originalUrl, "ex", 10);
      connectRedis.set("find_all_movies", true, "ex", 10);
      connectRedis.set("getReqMovies", JSON.stringify(getMoviesData), "ex", 10);
      res.json({
        message: "Success get all data movies",
        code: 200,
        total: getMoviesData.length,
        data: getMoviesData,
      });
    }
    if (page || limit || sort) {
      if (page && limit && sort) {
        getAllData = await models.getAllMoviesPaginationSort2({
          sort,
          limit,
          page,
        });
      } else if (page && limit) {
        getAllData = await models.getAllMoviesPagination2({ limit, page });
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("page", page, "ex", 10);
        connectRedis.set("limit", limit, "ex", 10);
        connectRedis.set("dataPerPage", JSON.stringify(getAllData), "ex", 10);
        connectRedis.set("getReqAccPagi", JSON.stringify(totalDatas), "ex", 10);
        connectRedis.set("isPaginated", true, "ex", 10);
      } else if (sort) {
        getAllData = await models.getAllMoviesSort2({ sort });
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("isSorted", true, "ex", 10);
        connectRedis.set("sortedData", JSON.stringify(getAllData), "ex", 10);
        res.json({
          message: "Success get all movies",
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
        message: "success get movies",
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

const addMovies = async (req, res) => {
  try {
    const {
      users_id,
      movie_name,
      category,
      director,
      casts,
      release_date,
      synopsis,
      movie_picture,
      duration,
      duration_hour,
      duration_mins,
    } = req.body;
    const getMoviesName = await models.getMoviesName({ movie_name });
    const getHour = duration.split(":")[0];
    const getMins = duration.split(":")[1];

    const roleValidator = req.users_id || null; // middleware for roleValidator
    const getRole = await models.getRoles({ roleValidator });
    const isAdmin = getRole[0]?.role;

    if (isAdmin == "ADMIN" && roleValidator == "1") {
      if (getMoviesName.length !== 0) {
        throw {
          code: 409,
          message: "Movies name already exists",
        };
      }

      let file = req.files.movie_picture;

      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        { public_id: uuidv4(), folder: "tickitz" },
        async function (error, result) {
          if (error) {
            throw error;
          }

          await models.addMovies({
            users_id: roleValidator,
            movie_name,
            category,
            director,
            casts,
            release_date,
            synopsis,
            movie_picture: result.public_id,
            duration,
            duration_hour: getHour,
            duration_mins: getMins,
          });
        }
      );

      res.status(201).json({
        status: "true",
        code: 201,
        message: "Success add new movie",
        data: { ...req.body },
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

const updateMoviesPartial = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      users_id,
      movie_name,
      category,
      director,
      casts,
      release_date,
      synopsis,
      movie_picture,
      duration,
      duration_hour,
      duration_mins,
    } = req.body;

    const getHour = duration ? duration.split(":")[0] : null;
    const getMins = duration ? duration.split(":")[1] : null;

    const roleValidator = req.users_id || null; // middleware for roleValidator
    const getRole = await models.getRoles({ roleValidator });
    const isAdmin = getRole[0]?.role;

    if (isAdmin == "ADMIN" && roleValidator == "1") {
      const getAllData = await models.getMoviesByID({ id });

      if (!req.files) {
        if (getAllData.length == 0) {
          throw { code: 400, message: "movies_id not identified" };
        } else {
          await models.updateMoviesPartial({
            movie_name,
            defaultValue: getAllData[0],
            category,
            director,
            casts,
            release_date,
            synopsis,
            duration,
            duration_hour: getHour,
            duration_mins: getMins,
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
        if (getAllData.length == 0) {
          throw { code: 400, message: "movies_id not identified" };
        } else {
          let file = req.files.movie_picture;

          cloudinary.v2.uploader.destroy(
            getAllData[0].movie_picture,
            function (error, result) {
              console.log(result, error);
            }
          );

          cloudinary.v2.uploader.upload(
            file.tempFilePath,
            { public_id: uuidv4(), folder: "tickitz" },
            async function (error, result) {
              if (error) {
                throw error;
              }

              await models.updateMoviesPartial({
                movie_name,
                defaultValue: getAllData[0],
                category,
                director,
                casts,
                release_date,
                synopsis,
                movie_picture: result.public_id,
                duration,
                duration_hour: getHour,
                duration_mins: getMins,
                id,
              });
            }
          );

          res.json({
            status: "true",
            message: "data updated",
            data: {
              id,
              ...req.body,
            },
            profile_picture: req.files.movie_picture.name,
          });
        }
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

const deleteMovies = async (req, res) => {
  try {
    const { id } = req.params;
    const getAllData = await models.getMoviesByID({ id });

    const roleValidator = req.users_id || null; // middleware for roleValidator
    const getRole = await models.getRoles({ roleValidator });
    const isAdmin = getRole[0]?.role;

    if (isAdmin == "ADMIN" && roleValidator == "1") {
      if (getAllData.length == 0) {
        throw { code: 400, message: "movies_id not identified" };
      }

      await models.deleteMovies({ id });
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
  getMoviesbyTitle,
  addMovies,
  updateMoviesPartial,
  deleteMovies,
  getMoviesbyTitle2,
  getMoviesJoin,
};
