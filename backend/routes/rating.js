const { addRating } = require("../database/rating_db");

const router = require("express").Router();

router.post("/addRating", async (req, res) => {
  try {
    const { idmovie, username, stars, description } = req.body
    await addRating(idmovie, username, stars, description);
    res.json({ message: "success" });
    res.end();
  } catch (error) {
    console.log("Failed to add rating", error)
    res.status(500).json({ message: "Error adding rating", error: error.message})
  }
});

module.exports = router;