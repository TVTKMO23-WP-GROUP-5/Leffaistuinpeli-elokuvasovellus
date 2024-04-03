import React, { useState } from "react";
import axios from "axios";

export default function Search() {
  const [movieData, setMovieData] = useState({ search: "" });
  const [moviePick, setMoviePick] = useState("");

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
        console.log(response.data[0]);
        setMoviePick(
          "https://image.tmdb.org/t/p/w342/" + response.data[0].poster_path
        );
        alert("Haussa tapahtuu jotain");
      })
      .catch((error) => {
        alert("Haussa tapahtuu jotain negatiivista");
      });
  };

  let posteri = "";

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="search"
          placeholder="Hae elokuvia tai sarjoja"
          onChange={handleChange}
        />
        <button type="submit">Jatka</button>
      </form>
      <img src={moviePick} alt="Posteri" />
    </>
  );
}
