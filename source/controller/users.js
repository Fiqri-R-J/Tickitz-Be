const db = require("../config/database");
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

const createUsers = async (req, res) => {
  try {
    const { email, username, phone_number, password } = req.body;
    const getEmail = await models.getEmail({ email });
    const getUsername = await models.getUsername({ username });
    const getPhoneNumber = await models.getPhoneNumber({ phone_number });

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    if (
      getEmail.length !== 0 &&
      getUsername.length !== 0 &&
      getPhoneNumber.length !== 0
    ) {
      throw {
        code: 409,
        message:
          "User with the provided email, username & phoneNumber already exists",
      };
    }
    if (
      getEmail.length == 0 &&
      getUsername.length !== 0 &&
      getPhoneNumber.length !== 0
    ) {
      throw {
        code: 409,
        message:
          "User with the provided phone number & username already exists",
      };
    }
    if (
      getEmail.length !== 0 &&
      getUsername.length == 0 &&
      getPhoneNumber.length !== 0
    ) {
      throw {
        code: 409,
        message: "User with the provided email & phone number already exists",
      };
    }
    if (
      getEmail.length !== 0 &&
      getUsername.length !== 0 &&
      getPhoneNumber.length == 0
    ) {
      throw {
        code: 409,
        message: "User with the provided email & username already exists",
      };
    }
    if (
      getEmail.length !== 0 &&
      getUsername.length == 0 &&
      getPhoneNumber.length == 0
    ) {
      throw {
        code: 409,
        message: "User with the provided email already exists",
      };
    }
    if (
      getEmail.length == 0 &&
      getUsername.length !== 0 &&
      getPhoneNumber.length == 0
    ) {
      throw {
        code: 409,
        message: "User with the provided username already exists",
      };
    }
    if (
      getEmail.length == 0 &&
      getUsername.length == 0 &&
      getPhoneNumber.length !== 0
    ) {
      throw {
        code: 409,
        message: "User with the provided phone number already exists",
      };
    }

    const addData = await models.createUsers({
      email,
      phone_number,
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      status: "true",
      code: 201,
      message: "Success Add new Movies",
      data: req.body.email,
    });
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error,
    });
  }
};

const updateUsersPartial = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phone_number, username, password, profile_picture } =
      req.body;

    const roleValidator = req.users_id || null; // middleware for roleValidator
    const getRole = await models.getRoles({ roleValidator });
    const isAdmin = getRole[0]?.role;

    const getAllData = await models.getUsersByID({ id });
    if (getAllData.length == 0) {
      throw { code: 400, message: "ID not identified" };
    }

    if ((isAdmin == "ADMIN" && roleValidator == "1") || roleValidator == id) {
      if (!req.files) {
        if (password == undefined) {
          await models.updateUsersPartial({
            email,
            defaultValue: getAllData[0],
            phone_number,
            username,
            password,
            profile_picture,
            id,
          });
        } else {
          bcrypt.hash(password, saltRounds, async function (err, hash) {
            try {
              if (err) {
                throw "Failed Authenticate, please try again";
                // throw new Error(400)
              }
              await models.updateUsersPartial({
                email,
                defaultValue: getAllData[0],
                phone_number,
                username,
                password: hash,
                profile_picture,
                id,
              });
            } catch (error) {
              res.status(error?.code ?? 500).json({
                message: error.message ?? error,
              });
            }
          });
        }

        res.json({
          status: "true",
          message: "data updated",
          data: {
            id,
            ...req.body,
          },
        });
      } else {
        if (getAllData.length == 0) {
          throw { code: 400, message: "ID not identified" };
        } else {
          if (password == undefined) {
            let file = req.files.profile_picture;

            cloudinary.v2.uploader.destroy(
              getAllData[0].profile_picture,
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

                await models.updateUsersPartial({
                  email,
                  defaultValue: getAllData[0],
                  phone_number,
                  username,
                  password,
                  profile_picture: result.public_id,
                  id,
                });
              }
            );
          } else {
            let file = req.files.profile_picture;

            cloudinary.v2.uploader.destroy(
              getAllData[0].profile_picture,
              function (error, result) {
                console.log(result, error);
              }
            );

            cloudinary.v2.uploader.upload(
              file.tempFilePath,
              { public_id: uuidv4(), folder: "tickitz" },
              async function (error, result) {
                if (error) {
                  throw "Upload failed";
                }
                bcrypt.hash(password, saltRounds, async function (err, hash) {
                  try {
                    if (err) {
                      throw "Failed Authenticate, please try again";
                    }

                    await models.updateUsersPartial({
                      email,
                      defaultValue: getAllData[0],
                      phone_number,
                      username,
                      password: hash,
                      profile_picture: result.public_id,
                      id,
                    });
                  } catch (error) {
                    res.status(500).json({
                      message: error.message,
                    });
                  }
                });
              }
            );
          }

          res.json({
            status: "true",
            message: "data updated",
            data: {
              id,
              ...req.body,
            },
            profile_picture: req.files.profile_picture.name,
          });
        }
      }
    } else {
      throw {
        code: 401,
        message:
          "Access not granted, only admin & valid user can access this section!",
      };
    }
  } catch (error) {
    if (error.code !== 500) {
      if (
        error.message ==
        'duplicate key value violates unique constraint "users_email_key"'
      ) {
        res.status(422).json({
          message: "User with the provided email already exists",
        });
      }
      if (
        error.message ==
        'duplicate key value violates unique constraint "users_username_key"'
      ) {
        res.status(422).json({
          message: "User with the provided username already exists",
        });
      }
      if (
        error.message ==
        'duplicate key value violates unique constraint "users_phone_number_key"'
      ) {
        res.status(422).json({
          message: "User with the provided phone number already exists",
        });
      } else {
        res.status(error?.code ?? 500).json({
          message: error.message ?? error,
        });
      }
    } else {
      res.status(500).json({
        message: error.message,
      });
    }
  }
};

const deleteUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const getAllData = await models.getUsersByID({ id });

    if (getAllData.length == 0) {
      throw { code: 400, message: "users_id not identified" };
    }

    const roleValidator = req.users_id || null; // middleware for roleValidator
    const getRole = await models.getRoles({ roleValidator });
    const isAdmin = getRole[0]?.role;

    if ((isAdmin == "ADMIN" && roleValidator == "1") || roleValidator == id) {
      await models.deleteUsers({ id });
      res.json({
        status: "true",
        message: "USER DELETED!",
      });
    } else {
      throw {
        code: 401,
        message:
          "Access not granted, only admin & valid user can access this section!",
      };
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getUsersByEmail,
  createUsers,
  updateUsersPartial,
  deleteUsers,
};
