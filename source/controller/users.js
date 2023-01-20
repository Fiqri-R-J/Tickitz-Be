const models = require("../models/users");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { connectRedis } = require("../middleware/redis");
const { cloudinary } = require("../middleware/upload");

const getUsersByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { page, limit, sort } = req.query;

    const totalDatas = await models.getAllUsers();

    let getUsersData;
    let getAllData;

    if (email) {
      getUsersData = await models.getUsersByEmail({ email });
      connectRedis.set("find_users", true, "ex", 10);
      connectRedis.set("url", req.originalUrl, "ex", 10);
      connectRedis.set("email_users", email, "ex", 10);
      connectRedis.set("getReqAccount", JSON.stringify(getUsersData), "ex", 10);
      if (getUsersData.length > 0) {
        res.json({
          message: `Get User With Email: ${email}`,
          code: 200,
          data: getUsersData,
        });
      } else {
        throw { code: 422, message: "Data not found" };
      }
    }
    if (!email && !page && !limit && !sort) {
      getUsersData = totalDatas;
      connectRedis.set("url", req.originalUrl, "ex", 10);
      connectRedis.set("find_all_users", true, "ex", 10);
      connectRedis.set("getReqAccount", JSON.stringify(getUsersData), "ex", 10);
      res.json({
        message: "Success get all data users",
        code: 200,
        total: getUsersData.length,
        data: getUsersData,
      });
    }
    if (page || limit || sort) {
      if (page && limit && sort) {
        getAllData = await models.getAllUsersPaginationSort({
          sort,
          limit,
          page,
        });
      } else if (page && limit) {
        getAllData = await models.getAllUsersPagination({ limit, page });
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("page", page, "ex", 10);
        connectRedis.set("limit", limit, "ex", 10);
        connectRedis.set("dataPerPage", JSON.stringify(getAllData), "ex", 10);
        connectRedis.set("getReqAccPagi", JSON.stringify(totalDatas), "ex", 10);
        connectRedis.set("isPaginated", true, "ex", 10);
      } else if (sort) {
        getAllData = await models.getAllUsersSort({ sort });
        connectRedis.set("url", req.originalUrl, "ex", 10);
        connectRedis.set("isSorted", true, "ex", 10);
        connectRedis.set("sortedData", JSON.stringify(getAllData), "ex", 10);
        res.json({
          message: "Success get all data users",
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
        message: "success get data",
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

module.exports = { getUsersByEmail };
