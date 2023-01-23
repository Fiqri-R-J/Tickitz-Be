require("dotenv").config();
const Redis = require("ioredis");

const connectRedis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

const getReqAccountByEmail_Redis = async (req, res, next) => {
  try {
    const url = await connectRedis.get("url");
    const matchedUrl = url == req.originalUrl;
    const find_users = await connectRedis.get("find_users");
    const find_all_users = await connectRedis.get("find_all_users");
    const email = await connectRedis.get("email_users");
    const page = await connectRedis.get("page");
    const limit = await connectRedis.get("limit");
    const isPaginated = await connectRedis.get("isPaginated");
    const isSorted = await connectRedis.get("isSorted");
    const getReqAccPagi = await connectRedis.get("getReqAccPagi");
    const dataPerPage = await connectRedis.get("dataPerPage");
    const sortedData = await connectRedis.get("sortedData");
    const getReqAccount = await connectRedis.get("getReqAccount");

    if (matchedUrl) {
      if (find_users && !find_all_users) {
        res.json({
          REDIS: true,
          message: `Get User With Email: ${email}`,
          code: 200,
          total: JSON.parse(getReqAccount).length,
          data: JSON.parse(getReqAccount),
        });
      }
      if (isSorted || find_all_users) {
        !find_all_users
          ? res.json({
              REDIS: true,
              message:
                email !== null
                  ? `Get User With Email: ${email}`
                  : "Success get all data users",
              code: 200,
              total: JSON.parse(sortedData).length,
              data: JSON.parse(sortedData),
            })
          : res.json({
              REDIS: true,
              message: "Success get all data users",
              code: 200,
              total: JSON.parse(getReqAccount).length,
              data: JSON.parse(getReqAccount),
            });
      }
      if (isPaginated && !isSorted) {
        res.json({
          REDIS: true,
          message: "success get data",
          code: 200,
          total: JSON.parse(getReqAccPagi).length,
          dataPerPage: JSON.parse(dataPerPage).length,
          page: `${page} from ${Math.ceil(
            JSON.parse(getReqAccPagi).length / limit
          )}`,
          data: JSON.parse(dataPerPage),
        });
      }
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({
      REDIS: true,
      message: `${error}`,
      data: [],
    });
  }
};

const getReqMoviesByTitle_Redis = async (req, res, next) => {
  try {
    const url = await connectRedis.get("url");
    const matchedUrl = url == req.originalUrl;
    const find_movies = await connectRedis.get("find_movies");
    const find_all_movies = await connectRedis.get("find_all_movies");
    const movie_name = await connectRedis.get("movie_name");
    const page = await connectRedis.get("page");
    const limit = await connectRedis.get("limit");
    const isPaginated = await connectRedis.get("isPaginated");
    const isSorted = await connectRedis.get("isSorted");
    const getReqAccPagi = await connectRedis.get("getReqAccPagi");
    const dataPerPage = await connectRedis.get("dataPerPage");
    const sortedData = await connectRedis.get("sortedData");
    const getReqMovies = await connectRedis.get("getReqMovies");

    if (matchedUrl) {
      if (find_movies && !find_all_movies) {
        res.json({
          REDIS: true,
          message: `Get Movie With Title: ${movie_name}`,
          code: 200,
          total: JSON.parse(getReqMovies).length,
          data: JSON.parse(getReqMovies),
        });
      }
      if (isSorted || find_all_movies) {
        !find_all_movies
          ? res.json({
              REDIS: true,
              message:
                movie_name !== null
                  ? `Get Movie With Title: ${movie_name}`
                  : "Success get all data movies",
              code: 200,
              total: JSON.parse(sortedData).length,
              data: JSON.parse(sortedData),
            })
          : res.json({
              REDIS: true,
              message: "Success get all data movies",
              code: 200,
              total: JSON.parse(getReqMovies).length,
              data: JSON.parse(getReqMovies),
            });
      }
      if (isPaginated && !isSorted) {
        res.json({
          REDIS: true,
          message: "success get data movies",
          code: 200,
          total: JSON.parse(getReqAccPagi).length,
          dataPerPage: JSON.parse(dataPerPage).length,
          page: `${page} from ${Math.ceil(
            JSON.parse(getReqAccPagi).length / limit
          )}`,
          data: JSON.parse(dataPerPage),
        });
      }
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({
      REDIS: true,
      message: `${error}`,
      data: [],
    });
  }
};

module.exports = {
  connectRedis,
  getReqAccountByEmail_Redis,
  getReqMoviesByTitle_Redis,
};
