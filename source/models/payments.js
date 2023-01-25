const db = require("../config/database");

const getRoles = async (params) => {
  const { roleValidator } = params;

  return await db`SELECT role from users WHERE users_id = ${roleValidator}`;
};

const getMoviesId = async (params) => {
  const { movies_id } = params;

  return await db`SELECT * FROM movies WHERE movies_id = ${movies_id}`;
};

const getSchedulesId = async (params) => {
  const { schedules_id } = params;

  return await db`SELECT * FROM schedules WHERE schedules_id = ${schedules_id}`;
};

const addPayments = async (params) => {
  const {
    users_id,
    movies_id,
    schedules_id,
    date_time,
    ticket_qty,
    total_payment,
    // ticket_status,
    payment_method,
    selected_seat,
    roleValidator,
  } = params;

  return await db`INSERT INTO payments ("users_id", "movies_id", "schedules_id", "date_time", "ticket_qty", "total_payment", "payment_method", "selected_seat") VALUES
  (${users_id}, ${movies_id}, ${schedules_id}, to_timestamp(${date_time},'HH24:MI'), ${ticket_qty}, ${total_payment}, ${payment_method}, string_to_array(${selected_seat}, ','))`;
};

const updateSchedulesSeat = async (params) => {
  const { available_seat, id } = params;

  return await db`UPDATE schedules SET available_seat = ${available_seat}, updated_at = NOW() AT TIME ZONE 'Asia/Jakarta' WHERE schedules_id = ${id}`;
};

module.exports = {
  getRoles,
  getMoviesId,
  getSchedulesId,
  addPayments,
  updateSchedulesSeat,
};