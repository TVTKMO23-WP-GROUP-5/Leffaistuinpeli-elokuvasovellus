const pgPool = require("./pg_connection");

const sql = {
  POST_MSG: `INSERT INTO groupmessage (username, groupname, msg) VALUES ($1, $2, $3)`,
  GET_MSGS: `SELECT username, msg, msgtime FROM groupmessage WHERE groupname=$1`
};

async function sendMessage(username, groupname, msg) {
  await pgPool.query(sql.POST_MSG, [username, groupname, msg]);
}

async function getAllMessages(groupname) {
  let result = await pgPool.query(sql.GET_MSGS, [groupname])
  return result.rows
}

module.exports = { sendMessage, getAllMessages };