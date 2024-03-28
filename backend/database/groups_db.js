const pgPool = require("./pg_connection");

const sql = {
  GET_ALLGROUPS: "SELECT * FROM groups",
  GET_GROUPBYNAME: "SELECT * FROM groups WHERE groupname=$1",
  POST_NEWGROUP: "INSERT INTO group (groupname, description, owner) VALUES ($1, $2, $3)"
};

async function getAllGroups() {
  let result = await pgPool.query(sql.GET_ALLGROUPS);
  return result.rows;
}

async function getGroupByName(groupname) {
    let result = await pgPool.query(sql.GET_GROUPBYNAME, [groupname]);
    return result.rows[0];
}


module.exports = { getAllGroups, getGroupByName };