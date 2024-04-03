import React, { useState } from "react";
import { useUser } from "../context/UseUser";
import axios from "axios";

export default function Search() {
  const [movieData, setMovieData] = useState({ search: "" });

  const handleChange = (e) => {
    setMovieData((prevMovieData) => ({
      ...prevMovieData,
      [e.target.name]: e.target.value
    }));
    console.log(movieData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!movieData) {
      console.log("movieDataa ei ole");
    }

    axios
      .post("http://localhost:3001/movies?query=", movieData)
      .then((response) => {
        console.log(response.data);
        alert("Haussa tapahtuu jotain");
      })
      .catch((error) => {
        alert("Haussa tapahtuu jotain negatiivista");
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Hae elokuvia tai sarjoja"
          onChange={handleChange}
        />
        <button type="submit">Jatka</button>
      </form>
    </>
  );
}
