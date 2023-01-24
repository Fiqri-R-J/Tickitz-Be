const db = require("../config/database");

const getMoviesId = async (params) => {
  const { movie_id } = params;

  return await db`SELECT * FROM movies WHERE movie_id = ${movie_id}`;
};

const getUsersId = async (params) => {
  const { users_id } = params;

  return await db`SELECT * FROM users WHERE users_id = ${users_id}`;
};

const addSchedules = async (params) => {
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
  } = params;

  return await db`INSERT INTO movies ("users_id", "movies_id", "time", "location", "price", "date_start", "date_end", "cinema", "available_seat") VALUES
      (${users_id}, ${movies_id}, ${time}, ${location}, ${price}, ${date_start}, ${date_end}, ${cinema}, ${available_seat})`;
};

module.exports = { getMoviesId, getUsersId, addSchedules };
