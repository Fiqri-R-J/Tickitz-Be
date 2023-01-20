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
    console.log("test1");
    const { email, username, phone_number, password } = req.body;
    console.log(req);
    console.log("test1.2");
    const salt = await bcrypt.genSalt(saltRounds);
    console.log("test1.3");
    console.log("test1.3.1");
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    console.log("test1.4");
    const getEmail = await models.getEmail({ email });
    console.log("test1.5");
    const getUsername = await models.getUsername({ username });
    console.log("test1.6");
    const getPhoneNumber = await models.getPhoneNumber({ phone_number });

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

    console.log("test2");

    await models.createUsers({
      email,
      username,
      phone_number,
      password: hashedPassword,
      // password,
    });

    res.status(201).json({
      status: "true",
      code: 201,
      message: "Success Create New Account",
      data: req.body.email,
    });
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error,
      test: "bego",
    });
  }
};

// const createUsers = async (req, res) => {
//   try {
//     const { email, phone_number, username, password, profile_picture } =
//       req.body
//     const salt = await bcrypt.genSalt(saltRounds)
//     const hashedPassword = await bcrypt.hash(req.body.password, salt)

//     const getEmail = await models.getEmail({ email })
//     const getUsername = await models.getUsername({ username })
//     const getPhoneNumber = await models.getPhoneNumber({ phone_number })
//     if (
//       getEmail.length !== 0 &&
//       getUsername.length !== 0 &&
//       getPhoneNumber.length !== 0
//     ) {
//       throw {
//         code: 409,
//         message:
//           'User with the provided email, username & phoneNumber already exists',
//       }
//     }
//     if (
//       getEmail.length == 0 &&
//       getUsername.length !== 0 &&
//       getPhoneNumber.length !== 0
//     ) {
//       throw {
//         code: 409,
//         message:
//           'User with the provided phone number & username already exists',
//       }
//     }
//     if (
//       getEmail.length !== 0 &&
//       getUsername.length == 0 &&
//       getPhoneNumber.length !== 0
//     ) {
//       throw {
//         code: 409,
//         message: 'User with the provided email & phone number already exists',
//       }
//     }
//     if (
//       getEmail.length !== 0 &&
//       getUsername.length !== 0 &&
//       getPhoneNumber.length == 0
//     ) {
//       throw {
//         code: 409,
//         message: 'User with the provided email & username already exists',
//       }
//     }
//     if (
//       getEmail.length !== 0 &&
//       getUsername.length == 0 &&
//       getPhoneNumber.length == 0
//     ) {
//       throw {
//         code: 409,
//         message: 'User with the provided email already exists',
//       }
//     }
//     if (
//       getEmail.length == 0 &&
//       getUsername.length !== 0 &&
//       getPhoneNumber.length == 0
//     ) {
//       throw {
//         code: 409,
//         message: 'User with the provided username already exists',
//       }
//     }
//     if (
//       getEmail.length == 0 &&
//       getUsername.length == 0 &&
//       getPhoneNumber.length !== 0
//     ) {
//       throw {
//         code: 409,
//         message: 'User with the provided phone number already exists',
//       }
//     }

//     if (!req.files) {
//       const addData = await models.createUsers({
//         email,
//         phone_number,
//         username,
//         password: hashedPassword,
//         profile_picture,
//         defaultPicture:
//           'https://res.cloudinary.com/daouvimjz/image/upload/v1673847179/blank-profile-picture-973460_tjapi1.png',
//       })

//       res.status(201).json({
//         status: 'true',
//         message: 'Success Create New Account',
//         data: req.body.email,
//       })
//     } else {
//       // The name of the input field (i.e. "file") is used to retrieve the uploaded file
//       let file = req.files.profile_picture
//       // let fileName = `${uuidv4()}-${file.name}`
//       // let rootDir = path.dirname(require.main.filename)
//       // console.log(file)
//       // let uploadPath = `${rootDir}/images/users/${fileName}`

//       cloudinary.v2.uploader.upload(
//         file.tempFilePath,
//         { public_id: uuidv4() },
//         function (error, result) {
//           if (error) {
//             throw 'Upload failed'
//           }

//           // Use the mv() method to place the file somewhere on your server
//           // file.mv(uploadPath, async function (err) {
//           //   if (err) {
//           //     throw { message: 'Upload failed' }
//           //   }

//           bcrypt.hash(password, saltRounds, async function (err, hash) {
//             try {
//               if (err) {
//                 throw 'Failed Authenticate, please try again'
//               }

//               const addData = await models.createUsers({
//                 email,
//                 phone_number,
//                 username,
//                 password: hash,
//                 // profile_picture: `/static/users/${fileName}`,
//                 profile_picture: result.public_id,
//                 defaultPicture:
//                   'https://res.cloudinary.com/daouvimjz/image/upload/v1671522875/Instagram_default_profile_kynrq6.jpg',
//               })

//               res.status(201).json({
//                 status: 'true',
//                 message: 'Success Create New Account',
//                 data: req.body.email,
//               })
//             } catch (error) {
//               res.status(error?.code ?? 500).json({
//                 message: error,
//               })
//             }
//           })
//           // })
//         }
//       )
//     }
//   } catch (error) {
//     res.status(error?.code ?? 500).json({
//       message: error,
//     })
//   }
// }

module.exports = { getUsersByEmail, createUsers };

// bcrypt.hash(password, saltRounds, async function (err, hash) {
//   try {
//     if (err) {
//       throw "Failed Authenticate, please try again";
//     }

//     const addData = await models.createUsers({
//       email,
//       phone_number,
//       username,
//       password: hash,
//     });

//     res.status(201).json({
//       status: "true",
//       message: "Success Create New Account",
//       data: req.body.email,
//     });
//   } catch (error) {
//     res.status(error?.code ?? 500).json({
//       message: error,
//     });
//   }
// });
