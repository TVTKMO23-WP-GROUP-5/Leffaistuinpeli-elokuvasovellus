import React, { useEffect, useState } from 'react'
import './Ratings.css'
import axios from 'axios'
import { useUser } from '../context/UseUser'

export default function Ratings() {
const { ratingsList, setRatingsList, user} = useUser()
const [ showRatings, setShowRatings ] = useState([])
const [ sort, setSort] = useState([])
const [ sortType, setSortType] = useState("name")
const [ isChecked, setIsChecked ] = useState(false)

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
          setShowRatings(response.data)
          setSort(response.data)
        })
        .catch((error) => {
          console.error("Error adding favorite:", error.response.data);
          alert("Virhe arvostelujen lataamisessa.");
        })
        console.log(ratingsList)
}, [user, setShowRatings])
  
const sortMovies = (sorting, check) => {
    console.log(sorting, check)
    if (sorting === "name"){
        const sortedRatings = [...showRatings].sort((a, b) => {
            const titleA = a.title ? a.title.toLowerCase() : a.name.toLowerCase();
            const titleB = b.title ? b.title.toLowerCase() : b.name.toLowerCase();
            if (check){
                return titleB.localeCompare(titleA);
            } else if (!check) {
                return titleA.localeCompare(titleB);
            }
            
        })
        setSort(sortedRatings)
    } else if (sorting ==="stars"){
        const sortedRatings = [...showRatings].sort((a, b) => {
            const starA = parseInt(a.stars);
            const starB = parseInt(b.stars);
            if (check){
                return starB - starA
            } else if (!check) {
                return starA - starB
            }
            
        })
        setSort(sortedRatings)
    } else if (sorting === "user") {
        const sortedRatings = [...showRatings].sort((a, b) => {
            const userA = a.rater.toLowerCase()
            const userB = b.rater.toLowerCase()
            if (check){
                return userB.localeCompare(userA)
            } else if (!check) {
                return userA.localeCompare(userB)
            }  
        })
        setSort(sortedRatings)
    }
}

return (
    <div>
        <div className = "choises">
            <select name = "sort" onChange = {(e) =>{
                setSortType(e.target.value) 
                sortMovies(e.target.value, isChecked)
            }}>
                <option disabled selected>Järjestä</option>
                <option value = "name">Elokuvan nimi</option>
                <option value = "stars">Tähdet</option>
                <option value = "user">Arvostelija</option>
            </select>
            <label class="toggle-switch">
                <input type="checkbox" checked = {isChecked} onChange={(e) => {
                    setIsChecked(e.target.checked)
                    sortMovies(sortType, e.target.checked)
                }}/>
                  <span className="slider">
                    <span className="arrow-up">&#9650;</span>
                    <span className="arrow-down">&#9660;</span>
                </span>
            </label>
        </div>
        <div className = "ratingslist">
            {sort &&
            sort.map((movie, index) => (
                <div className = "movieRatings">
                    <img
                        src={
                        "https://image.tmdb.org/t/p/w342/" + movie.poster_path
                        }
                        alt="Movie poster"
                    />
                    <div className = "movieDetails">
                        <p><strong>{movie.title ? movie.title : movie.name}</strong> {movie.media_type === "movie" ? (<span>(elokuva)</span>) : movie.media_type === "tv" && (<span>(tv-sarja)</span>) }</p>
                        <p>
                            {Array.from({ length: movie.stars }, (_, index) => (
                                <span key={index} className="ratingstars">&#9733;</span>
                            ))}
                        </p>
                        <p>Käyttäjä <strong>{movie.rater}:</strong>  {movie.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}
