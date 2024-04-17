const { addFavorite, addGroupFavorite, 
  getOwnFavorites, getGroupFavorites, 
  checkOwnFavorites, checkGroupFavorites 
} = require('../database/favorite_db')
const router = require("express").Router();
const fetch = require("node-fetch");

router.post("/addfavorite", async (req, res) => {
    try {  
      const idmovie = req.body.idmovie;
      const username = req.body.username;
      const isDublicate = await checkOwnFavorites(idmovie,username);

      if (isDublicate) {
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
      const isDublicate = await checkGroupFavorites(idmovie,groupname);

      if (isDublicate) {
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

router.get("/getownfavorites", async (req, res) => {
  const apiKey = process.env.MOVIEDB_API_KEY;
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const movieIds = await getOwnFavorites(username)
    if (movieIds.length === 0) {
      return res.status(404).json({ error: "No favorites found" })
    }

    console.log(movieIds)

    const movies = await Promise.all(movieIds.map(async (idObj) => {
      const castUrl = `https://api.themoviedb.org/3/movie/${idObj.idmovie}?api_key=${apiKey}`
      const response = await fetch(castUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }));

    res.json(movies);

  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
})


module.exports = router;