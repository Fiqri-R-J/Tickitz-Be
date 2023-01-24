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
    const getMoviesName = await models.getMoviesName({ movie_name });
    const getHour = duration.split(":")[0];
    const getMins = duration.split(":")[1];

    if (users_id !== "1") {
      throw {
        code: 401,
        message: "Access not granted!, only Admin can access this section",
      };
    }
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
          users_id,
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
  } catch (error) {
    res.status(error?.code ?? 500).json({
      message: error,
    });
  }
};

module.exports = { addSchedules };
