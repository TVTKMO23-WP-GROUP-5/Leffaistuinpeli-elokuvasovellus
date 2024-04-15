import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Movie.css";
import axios from "axios";
import { useUser } from "../context/UseUser";

export default function Movie() {
  const { user, moviePick, setMoviePick } = useUser()
  const [ratingData, setRatingData] = useState({
    idmovie: '',
    username: user ? user.username : '',
    stars: 0,
    description: ''
  })
  const [pickedObject, setPickedObject] = useState(null)
  const [hoverRating, setHoverRating] = useState(0)
  const [stars, setStars] = useState(0)

  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const id = queryParams.get("id")

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      if (moviePick && moviePick.length > 0) {
        const foundMovie = moviePick.find((m) => m.id.toString() === id.toString());
        if (foundMovie) {
          setPickedObject(foundMovie)
          setRatingData(prev => ({ ...prev, idmovie: foundMovie.id, username: user ? user.username : ''}))
        }
      } else {
        const storedMoviePick = sessionStorage.getItem('moviePick')
        if (storedMoviePick) {
          const parsedMoviePick = JSON.parse(storedMoviePick)
          setMoviePick(parsedMoviePick)
          const foundMovie = parsedMoviePick.find((m) => m.id.toString() === id)
          if (foundMovie && active) {
            setPickedObject(foundMovie)
            setRatingData(prev => ({...prev, idmovie: foundMovie.id, username: user ? user.username : ''}))
          }
        }
      }
    }

  fetchData();
  
  return () => {
    active = false
  }
  }, [id, moviePick, setMoviePick, user])


  const handleRating = (rate) => {
    const newRating = rate + 1
    setRatingData(prev => ({...prev, stars: newRating}))
    setStars(newRating)
    setHoverRating(newRating)
  }

  const handleMouseOver = (rate) => {
    setHoverRating(rate + 1)
  }

  const handleMouseLeave = () => {
    setHoverRating(ratingData.stars)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setRatingData(prev => ({
      ...prev,
      [name]: value
    }))
    console.log(ratingData)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    axios.post('http://localhost:3001/rating/addRating', ratingData)
        .then(response => {
            if (response.data.message === "success"){
                console.log('Rating registered successfully:', response.data);
                alert("Arvostelun luominen onnistui")
                resetReviewForm()
            } else {
                console.log('Something went wrong:', response.data);
                alert("Arvostelun luominen epäonnistui...")
            }
        })
        .catch(error => {
            console.error('Error registering rating:', error.response.data);
            alert("Virhe arvostelun luomisessa...")
        })  
  }

  const resetReviewForm = () => {
    setRatingData({
      idmovie: ratingData.idmovie,
      username: ratingData.username,
      stars: 0, 
      description: ''
    })
    setStars(0)
    setHoverRating(0)
  }

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
        setRatingData(prev => ({ ...prev, username: storedUsername }));
    }
}, []);

  return (
  <>
    {pickedObject ? (
    <div className="poster-container">
      <h3 className="title">
          {pickedObject.title ? pickedObject.title : null}
      </h3>
      <div className="movie_poster">
        {pickedObject.poster_path ? (
        <div>
          <img
            src={"https://image.tmdb.org/t/p/w342/" + pickedObject.poster_path}
            alt="Movie poster"
          />
        </div>
        ) : null}
      </div>
      <div className="movie_container">
        <p className="overview">{pickedObject.overview ? pickedObject.overview : null}</p>
        <div className="imdb">
          <p>
          IMDB-arvosana:{" "}
          {pickedObject.vote_average ? pickedObject.vote_average : null}
          </p>
        </div>
      </div>
    </div>
    ) : ( 
      <div>loading movie details..</div>
    )}
    {user && (
    <div className="ratings">
          <h2>Arvostele katsomasi elokuva tai sarja!</h2>
            <form onSubmit = {handleSubmit}>
              <div className="stars"
                onMouseLeave={handleMouseLeave}>
                {[1, 2, 3, 4, 5].map((star, index) => {
                  return (
                    <button
                      type="button"
                      key={index}
                      className={index <= hoverRating ? "on" : "off"} 
                      onClick={() => handleRating(index)}
                      onMouseOver={() => handleMouseOver(index)}
                    >
                      <span className="star">&#9733;</span>
                    </button>
                  )
                })}
              </div>
                <textarea className="rating_description"
                  type="text" 
                  name="description" 
                  placeholder='Mitä pidit?' 
                  value={ratingData.description}
                  onChange={handleChange} 
                />
                <button type="submit" className="continue">Jatka</button>
            </form>
    </div>)}
    </>
  )
}
