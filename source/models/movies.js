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

  return await db`SELECT * FROM movies WHERE movie_name LIKE '%' || ${title} || '%'`;
};

const getAllMoviesPaginationSort = async (params) => {
  const { limit, page, sort } = params;

  return await db`SELECT * FROM movies ${
    sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`
  } LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
};

const getAllMoviesPaginationSort2 = async (params) => {
  const { limit, page, sort } = params;

  return await db`SELECT * FROM movies ${
    sort ? db`ORDER BY release_date DESC` : db`ORDER BY release_date ASC`
  } LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
};

const getAllMoviesPagination = async (params) => {
  const { limit, page } = params;

  return await db`SELECT * FROM movies ORDER BY created_at ASC LIMIT ${limit} OFFSET ${
    limit * (page - 1)
  }`;
};

const getAllMoviesPagination2 = async (params) => {
  const { limit, page } = params;

  return await db`SELECT * FROM movies ORDER BY release_date ASC LIMIT ${limit} OFFSET ${
    limit * (page - 1)
  }`;
};

const getAllMoviesSort = async (params) => {
  const { sort } = params;

  return await db`SELECT * FROM movies ${
    sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`
  } `;
};

const getAllMoviesSort2 = async (params) => {
  const { sort } = params;

  return await db`SELECT * FROM movies ${
    sort ? db`ORDER BY release_date DESC` : db`ORDER BY release_date ASC`
  } `;
};

const getMoviesByID = async (params) => {
  const { id } = params;

  return await db`SELECT * FROM movies WHERE movies_id = ${id}`;
};

const updateMoviesPartial = async (params) => {
  const {
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
    defaultValue,
    id,
  } = params;

  return await db`UPDATE movies
  SET movie_name = ${movie_name || defaultValue?.movie_name},
  category = ${category || defaultValue?.category},
   director = ${director || defaultValue?.director},
   casts =${casts || defaultValue?.casts},
   release_date = ${release_date || defaultValue?.release_date},
   synopsis = ${synopsis || defaultValue?.synopsis},
   movie_picture = ${movie_picture || defaultValue?.movie_picture},
   duration = ${duration || defaultValue?.duration},
   duration_hour = ${duration_hour || defaultValue?.duration_hour},
   duration_mins = ${duration_mins || defaultValue?.duration_mins},
   updated_at = NOW() AT TIME ZONE 'Asia/Jakarta' 
  WHERE movies_id = ${id} `;
};

const deleteMovies = async (params) => {
  const { id } = params;

  return await db`DELETE FROM movies WHERE movies_id = ${id}`;
};

const getRoles = async (params) => {
  const { roleValidator } = params;

  return await db`SELECT role from users WHERE users_id = ${roleValidator}`;
};

module.exports = {
  addMovies,
  getMoviesName,
  getAllMovies,
  getMoviesByTitle,
  getAllMoviesPaginationSort,
  getAllMoviesPagination,
  getAllMoviesSort,
  getMoviesByID,
  updateMoviesPartial,
  deleteMovies,
  getAllMoviesPaginationSort2,
  getAllMoviesPagination2,
  getAllMoviesSort2,
  getRoles,
};
