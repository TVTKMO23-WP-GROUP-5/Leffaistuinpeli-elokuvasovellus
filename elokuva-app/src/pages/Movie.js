import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Movie.css";
import axios from "axios";
import { useUser } from "../context/UseUser";

export default function Movie() {
  const { moviePick, setMoviePick } = useUser();
  const [pickedObject, setPickedObject] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");


  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      if (moviePick && moviePick.length > 0) {
        const foundMovie = moviePick.find((m) => m.id.toString() === id.toString());
        if (foundMovie) {
          setPickedObject(foundMovie);
        }
      } else {
        const storedMoviePick = sessionStorage.getItem('moviePick')
        if (storedMoviePick) {
          const parsedMoviePick = JSON.parse(storedMoviePick)
          setMoviePick(parsedMoviePick)
          const foundMovie = parsedMoviePick.find((m) => m.id.toString() === id)
          if (foundMovie && active) {
            setPickedObject(foundMovie)
          }
        }
      }
    }

  fetchData();
  
  return () => {
    active = false;
  }
  }, [id, moviePick, setMoviePick])

  return (
  <>
    {pickedObject ? (
    <div className="poster-container">
      <div className="movie_poster">
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
      </div>
    </div>
    ) : ( 
      <div>loading movie details..</div>
    )}
    </>
  )
}
