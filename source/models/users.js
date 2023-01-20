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

const getEmail = async (params) => {
  const { email } = params;

  return await db`SELECT email FROM users WHERE email = ${email}`;
};

const getUsername = async (params) => {
  const { username } = params;

  return await db`SELECT username FROM users WHERE username = ${username}`;
};

const getPhoneNumber = async (params) => {
  const { phone_number } = params;

  return await db`SELECT phone_number FROM users WHERE phone_number = ${phone_number}`;
};

const createUsers = async (params) => {
  const { email, username, phone_number, password } = params;

  return await db`INSERT INTO users ("email", "username", "phone_number", "password") VALUES
  (${email}, ${username}, ${phone_number}, ${password})`;
};

const getUsersByID = async (params) => {
  const { id } = params;

  return await db`SELECT * FROM users WHERE users_id = ${id}`;
};

const updateUsersPartial = async (params) => {
  const {
    email,
    phone_number,
    username,
    password,
    profile_picture,
    defaultValue,
    id,
  } = params

  return await db`UPDATE users
  SET email = ${email || defaultValue?.email},
   phone_number = ${phone_number || defaultValue?.phone_number},
   username = ${username || defaultValue?.username},
   password =${password || defaultValue?.password},
   profile_picture = ${profile_picture || defaultValue?.profile_picture}
  WHERE users_id = ${id} `
}

module.exports = {
  getAllUsers,
  getUsersByEmail,
  getAllUsersPaginationSort,
  getAllUsersPagination,
  getAllUsersSort,
  getEmail,
  getUsername,
  getPhoneNumber,
  createUsers,
  getUsersByID,
  updateUsersPartial,
};
