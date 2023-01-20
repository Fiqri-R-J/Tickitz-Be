const { Module } = require("module");
const db = require("../config/database");

const getAllUsers = async () => {
  return await db`SELECT * FROM users ORDER BY created_at ASC`;
};

const getUsersByEmail = async (params) => {
  const { email } = params;

  return await db`SELECT * FROM users WHERE email = ${email}`;
};

const getAllUsersPaginationSort = async (params) => {
  const { limit, page, sort } = params;

  return await db`SELECT * FROM users ${
    sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`
  } LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
};

const getAllUsersPagination = async (params) => {
  const { limit, page } = params;

  return await db`SELECT * FROM users ORDER BY created_at ASC LIMIT ${limit} OFFSET ${
    limit * (page - 1)
  }`;
};

const getAllUsersSort = async (params) => {
  const { sort } = params;

  return await db`SELECT * FROM users ${
    sort ? db`ORDER BY created_at DESC` : db`ORDER BY created_at ASC`
  } `;
};

module.exports = {
  getAllUsers,
  getUsersByEmail,
  getAllUsersPaginationSort,
  getAllUsersPagination,
  getAllUsersSort,
};
