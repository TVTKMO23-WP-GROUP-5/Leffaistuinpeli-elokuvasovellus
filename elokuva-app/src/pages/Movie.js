import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Movie.css";
import axios from "axios";
import { useUser } from "../context/UseUser";

export default function Movie() {
  const { moviePick } = useUser();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const pickedObject = moviePick.find((m) => m.id.toString() === id.toString());
  console.log(pickedObject);

  return (
  <>
    <div className="poster-container">
            {pickedObject.poster_path ? (
        <img
          src={"https://image.tmdb.org/t/p/w342/" + pickedObject.poster_path}
          alt="Movie poster"
        />
      ) : null}
          </div>
    <div className="movie_container">
      <h3 className="title">
        {pickedObject.title ? pickedObject.title : null}
      </h3>
      <p className="overview">{pickedObject.overview ? pickedObject.overview : null}</p>
      <div className="imdb">
        <p>
          IMDB-arvosana:{" "}
          {pickedObject.vote_average ? pickedObject.vote_average : null}
        </p>
      </div>
      <div></div>
    </div>
    </>
  );
}
