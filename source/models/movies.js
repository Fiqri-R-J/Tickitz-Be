const db = require("../config/database");

const getMoviesName = async (params) => {
  const { movie_name } = params;

  return await db`SELECT movie_name FROM movies WHERE movie_name = ${movie_name}`;
};

const addMovies = async (params) => {
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
    duration_mins
  } = params;

  return await db`INSERT INTO movies ("users_id", "movie_name", "category", "director", "casts", "release_date", "synopsis", "movie_picture", "duration", "duration_hour", "duration_mins") VALUES
    (${users_id}, ${movie_name}, ${category}, ${director}, ${casts}, ${release_date}, ${synopsis}, ${movie_picture}, ${duration}, ${duration_hour}, ${duration_mins})`;
};

module.exports = { addMovies, getMoviesName };
