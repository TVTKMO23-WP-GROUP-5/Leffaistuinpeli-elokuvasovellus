const { addShowtime, getGroupShowtimes } = require("../database/groupST_db");

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

  router.get("/getgrouptimes", async (req,res) => {
    try {
        const gname = req.query.groupname;
        const showtimeData = await getGroupShowtimes(gname)
        res.json(showtimeData)
    } catch(error) {                                                                                    // jotka ovat samassa ryhmässä kuin admin
        console.error(error);
        res.status(500).send('Sever error');
    }  
})


module.exports = router;
