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
      const media_type = req.body.media_type;
      const isDublicate = await checkOwnFavorites(idmovie,username);

      if (isDublicate) {
        res.json({message:"duplicate"});
      } else {
            await addFavorite(idmovie, username, media_type);
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
      const media_type = req.body.media_type;
      const isDublicate = await checkGroupFavorites(idmovie,groupname);

      if (isDublicate) {
        res.json({message:"duplicate"});
      } else {
            await addGroupFavorite(idmovie, groupname, media_type);
            res.json({message: "success"})
            res.end();
        }
    } catch (error) {
      res.json({message: "tämmöinen virhe riviltä 42 favorite.js", error})
    }
});

router.get("/getownfavorites", async (req, res) => {
  const apiKey = process.env.MOVIEDB_API_KEY;
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const favorites = await getOwnFavorites(username)
    if (favorites.length === 0) {
      return res.status(404).json({ error: "No favorites found" })
    }

    const fetchDetails = async (favorite) => {
      const url = `https://api.themoviedb.org/3/${favorite.media_type ? favorite.media_type : 'movie'}/${favorite.idmovie}?api_key=${apiKey}`;
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
      const data = await response.json();
      return {...data, media_type: favorite.media_type ? favorite.media_type : 'movie'};
    }

    const results = await Promise.all(favorites.map(fetchDetails))
    res.json(results)

  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
})

router.get("/getgroupfavorites", async (req, res) => {
  const apiKey = process.env.MOVIEDB_API_KEY;
  const groupname = req.query.groupname;

  if (!groupname) {
    return res.status(400).json({ error: "Group is required" });
  }

  try {
    const favorites = await getGroupFavorites(groupname)
    if (favorites.length === 0) {
      return res.status(404).json({ error: "No favorites found" })
    }

    const fetchDetails = async (favorite) => {
      const url = `https://api.themoviedb.org/3/${favorite.media_type ? favorite.media_type : 'movie'}/${favorite.idmovie}?api_key=${apiKey}`;
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
      const data = await response.json();
      return {...data, media_type: favorite.media_type ? favorite.media_type : 'movie'};
    }

    const results = await Promise.all(favorites.map(fetchDetails))
    res.json(results)

  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
})


module.exports = router;