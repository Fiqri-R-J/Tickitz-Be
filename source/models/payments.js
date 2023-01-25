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

const getPayments = async () => {
  return await db`SELECT * FROM payments ORDER BY created_at ASC`;
};

const getPaymentsJoin = async () => {
  return await db`
    SELECT movies.movie_name, movies.category, schedules.time, schedules.price, schedules.date_start, schedules.date_end, schedules.cinema, payments.ticket_qty, payments.selected_seat, payments.total_payment, payments.ticket_status, payments.payments_id, payments.created_at
    FROM movies
    JOIN schedules ON movies.movies_id = schedules.movies_id
    JOIN payments ON schedules.schedules_id = payments.schedules_id
    ORDER BY payments.created_at
  `;
};

const getPaymentsbyId = async (params) => {
  const { title } = params;

  return await db`SELECT * FROM payments WHERE payments_id LIKE '%' || ${title} || '%'`;
};

const getPaymentsbyIdJoin = async (params) => {
  const { title } = params;

  return await db`
    SELECT movies.movie_name, movies.category, schedules.time, schedules.price, schedules.date_start, schedules.date_end, schedules.cinema, payments.ticket_qty, payments.selected_seat, payments.total_payment, payments.ticket_status, payments.payments_id, payments.created_at
    FROM movies
    JOIN schedules ON movies.movies_id = schedules.movies_id
    JOIN payments ON schedules.schedules_id = payments.schedules_id
    WHERE payments.payments_id = ${title}
  `;
};

const getAllPaymentsPaginationSort = async (params) => {
  const { limit, page, sort } = params;

  return await db`SELECT * FROM payments ${
    sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`
  } LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
};

const getAllPaymentsPaginationSortJoin = async (params) => {
  const { limit, page, sort } = params;

  return await db`
    SELECT movies.movie_name, movies.category, schedules.time, schedules.price, schedules.date_start, schedules.date_end, schedules.cinema, payments.ticket_qty, payments.selected_seat, payments.total_payment, payments.ticket_status, payments.payments_id, payments.created_at
    FROM movies
    JOIN schedules ON movies.movies_id = schedules.movies_id
    JOIN payments ON schedules.schedules_id = payments.schedules_id
    ${
      sort
        ? db`ORDER BY payments.created_at DESC`
        : db`ORDER BY payments.created_at ASC`
    }
    LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
};

const getAllPaymentsPagination = async (params) => {
  const { limit, page } = params;

  return await db`SELECT * FROM payments ORDER BY created_at ASC LIMIT ${limit} OFFSET ${
    limit * (page - 1)
  }`;
};

const getAllPaymentsPaginationJoin = async (params) => {
  const { limit, page } = params;

  return await db`
    SELECT movies.movie_name, movies.category, schedules.time, schedules.price, schedules.date_start, schedules.date_end, schedules.cinema, payments.ticket_qty, payments.selected_seat, payments.total_payment, payments.ticket_status, payments.payments_id, payments.created_at
    FROM movies
    JOIN schedules ON movies.movies_id = schedules.movies_id
    JOIN payments ON schedules.schedules_id = payments.schedules_id
    ORDER BY payments.created_at
    LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
};

const getAllPaymentsSort = async (params) => {
  const { sort } = params;

  return await db`SELECT * FROM payments ${
    sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`
  } `;
};

const getAllPaymentsSortJoin = async (params) => {
  const { sort } = params;

  return await db`
    SELECT movies.movie_name, movies.category, schedules.time, schedules.price, schedules.date_start, schedules.date_end, schedules.cinema, payments.ticket_qty, payments.selected_seat, payments.total_payment, payments.ticket_status, payments.payments_id, payments.created_at
    FROM movies
    JOIN schedules ON movies.movies_id = schedules.movies_id
    JOIN payments ON schedules.schedules_id = payments.schedules_id
    ${
      sort
        ? db`ORDER BY payments.created_at DESC`
        : db`ORDER BY payments.created_at ASC`
    }`;
};

const updatePaymentsPartial = async (params) => {
  const { ticket_status, id } = params;

  return await db`UPDATE payments
  SET ticket_status = ${ticket_status},
   updated_at = NOW() AT TIME ZONE 'Asia/Jakarta' 
  WHERE payments_id = ${id} `;
};

const getPaymentsbyIds = async (params) => {
  const { id } = params;

  return await db`SELECT * FROM payments WHERE payments_id = ${id}`;
};

module.exports = {
  getRoles,
  getMoviesId,
  getSchedulesId,
  addPayments,
  updateSchedulesSeat,
  getPayments,
  getPaymentsbyId,
  getAllPaymentsPaginationSort,
  getAllPaymentsPagination,
  getAllPaymentsSort,
  updatePaymentsPartial,
  getPaymentsbyIds,
  getPaymentsbyIdJoin,
  getPaymentsJoin,
  getAllPaymentsPaginationSortJoin,
  getAllPaymentsPaginationJoin,
  getAllPaymentsSortJoin,
};
