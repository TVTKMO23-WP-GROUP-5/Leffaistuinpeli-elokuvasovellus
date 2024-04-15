const pgPool = require("./pg_connection");

const sql = {
  REGISTER: "INSERT INTO account (fname, lname, email, username, password) VALUES ($1, $2, $3, $4, $5)",
  GET_PASSWORD: "SELECT password FROM account WHERE username=$1",
  DELETE_ACCOUNT: "DELETE FROM account WHERE username=$1"
};

async function register(fname, lname, email, username, pwHash) {
  await pgPool.query(sql.REGISTER, [fname, lname, email, username, pwHash]);
}

async function getPw(username) {
  const result = await pgPool.query(sql.GET_PASSWORD, [username]);
  return result.rowCount > 0 ? result.rows[0].password : null;
}

async function deleteAccount(username) {
  try {
    const result = await pgPool.query(sql.DELETE_ACCOUNT, [username]);
    return result;
  } catch (error) {
    throw error;
  }
}


module.exports = { register, getPw, deleteAccount };
