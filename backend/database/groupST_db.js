const pgPool = require("./pg_connection");

const sql = {
  POST_SHOWTIME: "INSERT INTO groupshowtimes (groupname, theatreID, showdate, movieID, movieTitle, showStartTime, img) VALUES ($1, $2, $3, $4, $5, $6, $7)",
};

async function addShowtime(groupname,theatreID,showdate,movieID,movieTitle,showStartTime,img) {
  await pgPool.query(sql.POST_SHOWTIME, [groupname,theatreID,showdate,movieID,movieTitle,showStartTime,img]);
}

module.exports = { addShowtime };