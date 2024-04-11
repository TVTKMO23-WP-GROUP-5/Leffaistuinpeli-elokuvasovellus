const pgPool = require("./pg_connection");

const sql = {
  REGISTER: "INSERT INTO account (fname, lname, email, username, password) VALUES ($1, $2, $3, $4, $5)", // Muutin hieman. Lisäsin (fname, lname, email, username, password). Jaakko
  GET_PASSWORD: "SELECT password FROM account WHERE username=$1",
};

async function register(fname, lname, email, username, pwHash) {
  await pgPool.query(sql.REGISTER, [fname, lname, email, username, pwHash]);
}

async function getPw(username) {
  const result = await pgPool.query(sql.GET_PASSWORD, [username]);

  return result.rowCount > 0 ? result.rows[0].password : null;
}

module.exports = { register, getPw };
