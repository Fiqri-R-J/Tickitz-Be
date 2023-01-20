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
      if (find_all_users) {
        console.log("test bawah");
        res.json({
          REDIS: true,
          message: "Success get all data users",
          code: 200,
          total: JSON.parse(getReqAccount).length,
          data: JSON.parse(getReqAccount),
        });
      }
      if (isSorted) {
        res.json({
          REDIS: true,
          message:
            email !== null
              ? `Get User With Email: ${email}`
              : "Success get all data users",
          code: 200,
          total: JSON.parse(sortedData).length,
          data: JSON.parse(sortedData),
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

module.exports = {
  connectRedis,
  getReqAccountByEmail_Redis,
};
