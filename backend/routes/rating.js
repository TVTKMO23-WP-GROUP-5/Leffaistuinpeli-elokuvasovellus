const { addRating, getAllRatings } = require("../database/rating_db");

const router = require("express").Router();

router.post("/addRating", async (req, res) => {
  try {
    const { idmovie, media_type, username, stars, description } = req.body; // Jaakko lisäsi media_typen. Jos sekoaa, poista.
    await addRating(idmovie, media_type, username, stars, description);
    res.json({ message: "success" });
    res.end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding rating", error: error.message });
  }
});

router.get("/getrating", async (req, res) => {
  try {
    const ratings = await getAllRatings();
    res.send(ratings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting rating", error: error.message });
  }
});

router.post("/ratedmoviedata", async (req, res) => {
  const ratedList = req.body.data;

  const apiKey = process.env.MOVIEDB_API_KEY;

  try {
    const fetchDetails = async (rated) => {
      const url = `https://api.themoviedb.org/3/${rated.media_type}/${rated.idmovie}?api_key=${apiKey}&language=fi-FI`;
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return {
        ...data,
        media_type: rated.media_type,
        stars: rated.stars,
        rater: rated.username,
        description: rated.description,
      };
    };

    const results = await Promise.all(ratedList.map(fetchDetails));
    res.json(results);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
});

module.exports = router;
