const pgPool = require("./pg_connection");

// valitaan groupmember siten, että jos ryhmäjäsenen idnumero täsmää accountin idnumeroon
const sql = {
    GET_MEMBERSINGROUP: "SELECT a.username FROM account a INNER JOIN groupmembers gm ON a.idaccount = gm.idaccount WHERE gm.idgroup = $1",
    GET_GROUPID: "SELECT idgroup, groupname, description FROM groups WHERE owner = $1",
    GET_IDACCOUNT: "SELECT idaccount FROM account WHERE username = $1",
    DELETE_MEMBERFROMGROUP: "DELETE FROM groupmembers WHERE idgroup = $1 AND idaccount = $2"
  };

async function getGroupMember(idgroup) {
    let result = await pgPool.query(sql.GET_MEMBERSINGROUP, [idgroup]);
    return result.rows;
  }

async function getGroupId(owner) {
    let result = await pgPool.query(sql.GET_GROUPID, [owner]);
    return result.rows[0]
}

async function gedDeleteId(uname) {
    let result = await pgPool.query(sql.GET_IDACCOUNT, [uname]);
    return result.rows[0]
}

async function deleteMemberFromGroup(idgroup, idaccount) {
    await pgPool.query(sql.DELETE_MEMBERFROMGROUP, [idgroup, idaccount]);
}

module.exports = { getGroupMember, getGroupId, gedDeleteId, deleteMemberFromGroup };
  
