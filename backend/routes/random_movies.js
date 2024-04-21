const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/homepage', async (req, res) => {
  const randomPage = Math.floor(Math.random() * 500) + 1;

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
      params: {
        api_key: process.env.MOVIEDB_API_KEY,
        sort_by: 'popularity.desc',
        page: randomPage
      }
    });

    const movies = response.data.results.slice(0, 9).map(movie => ({
      id: movie.id,
      title: movie.title,
      poster_path: `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    }));

    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies for homepage:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;