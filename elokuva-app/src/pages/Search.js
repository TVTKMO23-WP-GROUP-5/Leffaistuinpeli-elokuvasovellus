import React, { useState, useRef } from "react";
import axios from "axios";
import "./Search.css";
import no_image from "../images/no_image.png";

export default function Search() {
  const [movieData, setMovieData] = useState({ search: "" });
  const [moviePick, setMoviePick] = useState([]);
  const resultsRef = useRef(null);

  const handleChange = (e) => {
    setMovieData((prevMovieData) => ({
      ...prevMovieData,
      [e.target.name]: e.target.value,
    }));
    console.log(movieData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!movieData) {
      console.log("movieDataa ei ole");
    }

    console.log("Tämä on" + JSON.stringify(movieData));

    axios
      .post("http://localhost:3001/movies?query=", movieData)
      .then((response) => {
        setMoviePick(response.data);
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        /*setMoviePick(
          "https://image.tmdb.org/t/p/w342/" + response.data[0].poster_path
        );*/
      })
      .catch((error) => {
        alert("Haku epäonnistui jostain syystä");
      });
  };

  return (
    <div className="searchpage-container">
      <form className="search" onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          placeholder="Hae elokuvia tai sarjoja"
          onChange={handleChange}
        />
        <button type="submit">Jatka</button>
      </form>
      <div className="movieList" ref={resultsRef}>
        {moviePick &&
          moviePick.map((movie, index) => (
            <div className="poster" key={index}>
              {/*<h2>{movie.title}</h2>*/}
              {movie.poster_path ? (
                <img
                  src={"https://image.tmdb.org/t/p/w342/" + movie.poster_path}
                  alt="Movie poster"
                />
              ) : null}
            </div>
          ))}
      </div>
    </div>
  );
}
