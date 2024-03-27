const pgPool = require("./pg_connection");

const sql = {
  GET_ACCOUNT: "SELECT fname, lname, username FROM account WHERE username=$1",
};

async function getAccount(username) {
  let result = await pgPool.query(sql.GET_ACCOUNT, [username]);
  return result.rows[0];
}

module.exports = { getAccount };
