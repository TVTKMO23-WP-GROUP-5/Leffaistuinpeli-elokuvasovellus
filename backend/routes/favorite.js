const { addFavorite, addGroupFavorite, getOwnFavorites, getGroupFavorites } = require('../database/favorite_db')
const router = require("express").Router();

router.post("/addfavorite", async (req, res) => {
    try {  
      const idmovie = req.body.idmovie;
      const username = req.body.username;
      const ownfavorites = await getOwnFavorites();

      if (ownfavorites.includes = idmovie && username) {
        res.json({message:"duplicate"});
      } else {
            await addFavorite(idmovie, username);
            res.json({message: "success"})
            res.end();
        }
    } catch (error) {
      res.json({message: error})
    }
});

router.post("/addgroupfavorite", async (req, res) => {
    try {  
      const idmovie = req.body.idmovie;
      const groupname = req.body.groupname;
      const groupfavorites = await getGroupFavorites(groupname);

      if (groupfavorites.includes = idmovie) {
        res.json({message:"duplicate"});
      } else {
            await addGroupFavorite(idmovie, groupname);
            res.json({message: "success"})
            res.end();
        }
    } catch (error) {
      res.json({message: error})
    }
});


module.exports = router;