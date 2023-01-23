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
    duration_mins,
  } = params;

  return await db`INSERT INTO movies ("users_id", "movie_name", "category", "director", "casts", "release_date", "synopsis", "movie_picture", "duration", "duration_hour", "duration_mins") VALUES
    (${users_id}, ${movie_name}, ${category}, ${director}, ${casts}, ${release_date}, ${synopsis}, ${movie_picture}, ${duration}, ${duration_hour}, ${duration_mins})`;
};

const getAllMovies = async () => {
  return await db`SELECT * FROM movies ORDER BY created_at ASC`;
};

const getMoviesByTitle = async (params) => {
  const { title } = params;

  return await db`SELECT * FROM movies WHERE movie_name LIKE ${
    "%" + title + "%"
  }`;
};

const getAllMoviesPaginationSort = async (params) => {
  const { limit, page, sort } = params;

  return await db`SELECT * FROM movies ${
    sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`
  } LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
};

const getAllMoviesPagination = async (params) => {
  const { limit, page } = params;

  return await db`SELECT * FROM movies ORDER BY created_at ASC LIMIT ${limit} OFFSET ${
    limit * (page - 1)
  }`;
};

const getAllMoviesSort = async (params) => {
  const { sort } = params;

  return await db`SELECT * FROM movies ${
    sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`
  } `;
};

module.exports = {
  addMovies,
  getMoviesName,
  getAllMovies,
  getMoviesByTitle,
  getAllMoviesPaginationSort,
  getAllMoviesPagination,
  getAllMoviesSort,
};
