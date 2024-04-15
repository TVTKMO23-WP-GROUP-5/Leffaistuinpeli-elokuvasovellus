const pgPool = require("./pg_connection");

const sql = {
  GET_ALLGROUPS: "SELECT * FROM groups",
  GET_GROUPBNAME: "SELECT * FROM groups WHERE groupname=$1",
  GET_OWNGROUPS: `SELECT * FROM groups 
                  INNER JOIN groupmembers 
                  ON groups.idGroup=groupmembers.idGroup 
                  INNER JOIN account 
                  ON groupmembers.idAccount=account.idAccount 
                  WHERE account.username=$1 
                  AND groupmembers.isMember = TRUE`, // Jaakko lisäsi, että se tarkistaa isMemberin.
  GET_GROUPID: "SELECT idgroup FROM groups WHERE groupname=$1",
  GET_OWNERID: "SELECT idaccount FROM account INNER JOIN groups on account.username=groups.owner WHERE groups.owner=$1",
  GET_OWNERSNAME: "SELECT owner FROM groups WHERE groupname=$1",
  POST_NEWGROUP: "INSERT INTO group (groupname, description, owner) VALUES ($1, $2, $3)",
  DELETE_GROUP: "DELETE FROM groups WHERE idgroup=$1"
};

async function getAllGroups() {
  let result = await pgPool.query(sql.GET_ALLGROUPS);
  return result.rows;
}

async function getOwnGroups(username) {
  let result = await pgPool.query(sql.GET_OWNGROUPS, [username]);
  return result.rows;
}

async function getGroupId(groupname) {
  let result = await pgPool.query(sql.GET_GROUPID, [groupname]);
  return result.rows[0];
}

async function getOwnerid(owner) {
  let result = await pgPool.query(sql.GET_OWNERID, [owner]);
  return result.rows[0];
}

async function getOwnersName(groupname) {
  let result = await pgPool.query(sql.GET_OWNERSNAME, [groupname]);
  return result.rows[0];
}

async function deleteGroup(idgroup) {
  let result = await pgPool.query(sql.DELETE_GROUP, [idgroup]);
  return result.rows[0]
}
async function createGroup(groupname, description, owner) {
  let result = await pgPool.query(sql.POST_NEWGROUP, [groupname, description, owner]);
  
}



module.exports = { getAllGroups, getGroupByName, getGroupsByUsername, getGroupId, getOwnerid, getOwnersName, deleteGroup, createGroup };

module.exports = { getAllGroups, getOwnGroups, getGroupId, getOwnerid, getOwnersName, deleteGroup };
