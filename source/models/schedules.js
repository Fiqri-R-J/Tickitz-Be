const db = require("../config/database");

const getRoles = async (params) => {
  const { roleValidator } = params;

  return await db`SELECT role from users WHERE users_id = ${roleValidator}`;
};

const getMoviesId = async (params) => {
  const { movies_id } = params;

  return await db`SELECT * FROM movies WHERE movies_id = ${movies_id}`;
};

const getUsersId = async (params) => {
  const { users_id } = params;

  return await db`SELECT * FROM users WHERE users_id = ${users_id}`;
};

// const addSchedules = async (params) => {
//   const {
//     users_id,
//     movies_id,
//     time,
//     location,
//     price,
//     date_start,
//     date_end,
//     cinema,
//     available_seat,
//   } = params;

//   return await db`INSERT INTO schedules ("users_id", "movies_id", "time", "location", "price", "date_start", "date_end", "cinema", "available_seat") VALUES
//       (${users_id}, ${movies_id}, ${time}, ${location}, ${price}, ${date_start}, ${date_end}, ${cinema}, ${available_seat})`;
// };

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
    roleValidator,
  } = params;

  return await db`INSERT INTO schedules ("users_id", "movies_id", "time", "location", "price", "date_start", "date_end", "cinema") VALUES
      (${users_id}, ${movies_id}, ${time}, ${location}, ${price}, ${date_start}, ${date_end}, ${cinema})`;
};

const getAllSchedules = async () => {
  return await db`SELECT * FROM schedules ORDER BY time ASC`;
};

const getAllSchedules2 = async () => {
  return await db`SELECT * FROM schedules ORDER BY created_at ASC`;
};

const getSchedulesByTitle = async (params) => {
  const { title } = params;

  return await db`SELECT * FROM schedules WHERE location LIKE '%' || ${title} || '%'`;
};

const getSchedulesByTitle2 = async (params) => {
  const { title } = params;

  return await db`SELECT * FROM schedules WHERE cinema LIKE '%' || ${title} || '%'`;
};

const getAllSchedulesPaginationSort = async (params) => {
  const { limit, page, sort } = params;

  return await db`SELECT * FROM schedules ${
    sort ? db`ORDER BY time DESC` : db`ORDER BY time ASC`
  } LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
};

const getAllSchedulesPaginationSort2 = async (params) => {
  const { limit, page, sort } = params;

  return await db`SELECT * FROM schedules ${
    sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`
  } LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
};

const getAllSchedulesPagination = async (params) => {
  const { limit, page } = params;

  return await db`SELECT * FROM schedules ORDER BY time ASC LIMIT ${limit} OFFSET ${
    limit * (page - 1)
  }`;
};

const getAllSchedulesPagination2 = async (params) => {
  const { limit, page } = params;

  return await db`SELECT * FROM schedules ORDER BY created_at ASC LIMIT ${limit} OFFSET ${
    limit * (page - 1)
  }`;
};

const getAllSchedulesSort = async (params) => {
  const { sort } = params;

  return await db`SELECT * FROM schedules ${
    sort ? db`ORDER BY time DESC` : db`ORDER BY time ASC`
  } `;
};

const getAllSchedulesSort2 = async (params) => {
  const { sort } = params;

  return await db`SELECT * FROM schedules ${
    sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`
  } `;
};

const getSchedulesByID = async (params) => {
  const { id } = params;

  return await db`SELECT * FROM schedules WHERE schedules_id = ${id}`;
};

// const updateSchedulesPartial = async (params) => {
//   const {
//     roleValidator,
//     users_id,
//     movies_id,
//     time,
//     location,
//     price,
//     date_start,
//     date_end,
//     cinema,
//     available_seat,
//     defaultValue,
//     id,
//   } = params;

//   return await db`UPDATE schedules
//   SET users_id = ${roleValidator || defaultValue?.users_id},
//   movies_id = ${movies_id || defaultValue?.movies_id},
//    time = ${time || defaultValue?.time},
//    location =${location || defaultValue?.location},
//    price = ${price || defaultValue?.price},
//    date_start = ${date_start || defaultValue?.date_start},
//    date_end = ${date_end || defaultValue?.date_end},
//    cinema = ${cinema || defaultValue?.cinema},
//    available_seat = ${available_seat || defaultValue?.available_seat},
//    updated_at = NOW() AT TIME ZONE 'Asia/Jakarta'
//   WHERE schedules_id = ${id} `;
// };

const updateSchedulesPartial = async (params) => {
  const {
    roleValidator,
    users_id,
    movies_id,
    time,
    location,
    price,
    date_start,
    date_end,
    cinema,
    defaultValue,
    id,
  } = params;

  return await db`UPDATE schedules
  SET users_id = ${roleValidator || defaultValue?.users_id},
  movies_id = ${movies_id || defaultValue?.movies_id},
   time = ${time || defaultValue?.time},
   location =${location || defaultValue?.location},
   price = ${price || defaultValue?.price},
   date_start = ${date_start || defaultValue?.date_start},
   date_end = ${date_end || defaultValue?.date_end},
   cinema = ${cinema || defaultValue?.cinema},
   updated_at = NOW() AT TIME ZONE 'Asia/Jakarta' 
  WHERE schedules_id = ${id} `;
};

const deleteSchedules = async (params) => {
  const { id } = params;

  return await db`DELETE FROM schedules WHERE schedules_id = ${id}`;
};

module.exports = {
  getMoviesId,
  getUsersId,
  addSchedules,
  getRoles,
  getAllSchedules,
  getSchedulesByTitle,
  getAllSchedulesPaginationSort,
  getAllSchedulesPagination,
  getAllSchedulesSort,
  getSchedulesByTitle2,
  getAllSchedulesPaginationSort2,
  getAllSchedulesSort2,
  getAllSchedules2,
  getAllSchedulesPagination2,
  getSchedulesByID,
  updateSchedulesPartial,
  deleteSchedules,
};
