import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Search.css";
import { useUser } from "../context/UseUser";

export default function Search() {
  const [movieData, setMovieData] = useState({ search: "" });
  const { moviePick, setMoviePick } = useUser();
  const resultsRef = useRef(null);

  useEffect(() => {
    setMoviePick(null);
  }, [setMoviePick]);

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
          resultsRef.current.scrollIntoView({ behavior: "smooth" });
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
                <Link to={`/movie/?id=${movie.id}`}>
                  {/*<Link to={`/movie/${(movie.title)}?poster=${(movie.poster_path)}/${(movie.id)}`}>*/}
                  <img
                    src={"https://image.tmdb.org/t/p/w342/" + movie.poster_path}
                    alt="Movie poster"
                  />
                </Link>
              ) : null}
            </div>
          ))}
      </div>
    </div>
  );
}
