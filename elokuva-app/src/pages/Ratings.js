import React, { useEffect, useState } from 'react'
import './Ratings.css'
import axios from 'axios'
import { useUser } from '../context/UseUser'

export default function Ratings() {
const { ratingsList, setRatingsList, user} = useUser()
const [ showRatings, setShowRatings ] = useState([])

useEffect(() => {
    axios.get("http://localhost:3001/rating/getrating")
        .then((response) => {
          setRatingsList(response.data)
        })
        .catch((error) => {
          console.error("Error adding favorite:", error.response.data);
          alert("Virhe arvostelujen lataamisessa.");
        })
})

useEffect(() => {
    axios.post("http://localhost:3001/rating/ratedmoviedata", {data: ratingsList})
        .then((response) => {
          console.log(response.data)
          setShowRatings(response.data)
        })
        .catch((error) => {
          console.error("Error adding favorite:", error.response.data);
          alert("Virhe arvostelujen lataamisessa.");
        })
        console.log(ratingsList)
}, [user, setShowRatings])
  


return (
    <div className = "ratingslist">
        {showRatings &&
        showRatings.map((movie, index) => (
            <div className = "movieRatings">
                <img
                    src={
                      "https://image.tmdb.org/t/p/w342/" + movie.poster_path
                    }
                    alt="Movie poster"
                />
                <div className = "movieDetails">
                    <p><strong>{movie.title ? movie.title : movie.name}</strong> {movie.media_type === "movie" ? (<span>(elokuva)</span>) : movie.media_type === "tv" && (<span>(tv-sarja)</span>) }</p>
                    <p><strong>Tähtiä:</strong> {movie.stars}</p>
                    <p><strong>{movie.rater}</strong> arvostelee: {movie.description}</p>
                </div>
            </div>
        ))}
    </div>
  )
}
