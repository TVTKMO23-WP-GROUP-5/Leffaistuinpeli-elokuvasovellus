import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Search.css";
import no_image from "../images/no_image.png";

export default function Search() {
  const [movieData, setMovieData] = useState({ search: "" });
  const [moviePick, setMoviePick] = useState([]);

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
        /*setMoviePick(
          "https://image.tmdb.org/t/p/w342/" + response.data[0].poster_path
        );*/
        alert("Haussa tapahtuu jotain");
      })
      .catch((error) => {
        alert("Haussa tapahtuu jotain negatiivista");
      });
  };

  return (
    <>
      <form className="search" onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          placeholder="Hae elokuvia tai sarjoja"
          onChange={handleChange}
        />
        <button type="submit">Jatka</button>
      </form>
      <div className="movieList">
        {moviePick &&
          moviePick.map((movie, index) => (
            <div className="poster" key={index}>
              {/*<h2>{movie.title}</h2>*/}
              {movie.poster_path ? (
                <Link to={`/movie/${(movie.title)}`}>
                <img
                  src={"https://image.tmdb.org/t/p/w342/" + movie.poster_path}
                  alt="joo"
                />
                </Link>
              ) : null}
            </div>
          ))}
      </div>
    </>
  );
}
