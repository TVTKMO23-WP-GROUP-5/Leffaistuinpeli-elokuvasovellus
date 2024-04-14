require("dotenv").config();
const fetch = require("node-fetch");
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
      params: {
        api_key: process.env.MOVIEDB_API_KEY,
        sort_by: 'popularity.desc',
        page: Math.floor(Math.random() * 500) + 1
      }
    });
    res.json(response.data.results);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;