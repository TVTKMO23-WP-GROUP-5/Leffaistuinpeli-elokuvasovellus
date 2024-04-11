const pgPool = require("./pg_connection");

// valitaan groupmember siten, että jos ryhmäjäsenen idnumero täsmää accountin idnumeroon
const sql = {
    GET_MEMBERSINGROUP: "SELECT a.username FROM account a INNER JOIN groupmembers gm ON a.idaccount = gm.idaccount WHERE gm.idgroup = $1 AND gm.ismember = TRUE",
    GET_APPLICATION: "SELECT a.username FROM account a INNER JOIN groupmembers gm ON a.idaccount = gm.idaccount WHERE gm.idgroup = $1 AND gm.ismember = FALSE",
    UPDATE_ISMEMBER: "UPDATE groupmembers SET ismember = TRUE WHERE idgroup = $1 AND idaccount = $2",
    GET_GROUPID: "SELECT idgroup, groupname, description FROM groups WHERE owner = $1",
    GET_IDACCOUNT: "SELECT idaccount FROM account WHERE username = $1",
    DELETE_MEMBERFROMGROUP: "DELETE FROM groupmembers WHERE idgroup = $1 AND idaccount = $2",
    DELETE_ALLMEMBERS: "DELETE FROM groupmembers WHERE idgroup = $1",
    DELETE_GROUP: "DELETE FROM groups WHERE idgroup = $1 AND owner = $2",
    INSERT_APPLICATION: "INSERT INTO groupmembers (idgroup, idaccount) VALUES ($1, $2)",
    CHECK_USER_OWNER: "SELECT EXISTS (SELECT 1 FROM groups WHERE owner = $1)"
  };

async function getGroupMember(idgroup) {
    let result = await pgPool.query(sql.GET_MEMBERSINGROUP, [idgroup]);
    return result.rows;
  }

async function getGroupApplication(idgroup) {
  let result = await pgPool.query(sql.GET_APPLICATION, [idgroup]);
  return result.rows;
}

async function updateGroupMembership(idgroup, idaccount) {
  await pgPool.query(sql.UPDATE_ISMEMBER, [idgroup, idaccount]);
}

async function getGroupId(owner) {
    let result = await pgPool.query(sql.GET_GROUPID, [owner]);
    return result.rows
}

async function getAccountId(uname) {
    let result = await pgPool.query(sql.GET_IDACCOUNT, [uname]);
    return result.rows[0]
}

async function deleteMemberFromGroup(idgroup, idaccount) {
    await pgPool.query(sql.DELETE_MEMBERFROMGROUP, [idgroup, idaccount]);
}

async function deleteAllMembers(idgroup) {
  await pgPool.query(sql.DELETE_ALLMEMBERS, [idgroup]);
}

async function deleteGroup(idgroup, owner) {
  await pgPool.query(sql.DELETE_GROUP, [idgroup, owner]);
}

async function groupApplication(idgroup,idaccount) {
  await pgPool.query(sql.INSERT_APPLICATION, [idgroup,idaccount]);
}

async function checkUserOwner(username) {
  const result = await pgPool.query(sql.CHECK_USER_OWNER, [username]);
  return result.rows[0].exists;
}

module.exports = { 
  getGroupMember, 
  getGroupId, 
  getAccountId, 
  deleteMemberFromGroup, 
  deleteGroup, 
  getGroupApplication, 
  updateGroupMembership,
  deleteAllMembers,
  groupApplication, 
  checkUserOwner 
}
  
