const { addShowtime } = require("../database/groupST_db");

const router = require("express").Router();

router.post("/addshowtime", async (req, res) => {
    try {  
        const { groupname, theatreid, showdate, movieid, movietitle, showstarttime, img } = req.body
      await addShowtime(groupname, theatreid, showdate, movieid, movietitle, showstarttime, img);
      res.json({message: "success"})
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  });

module.exports = router;
