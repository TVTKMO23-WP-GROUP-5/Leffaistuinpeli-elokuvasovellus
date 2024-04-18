import React, { useEffect, useState } from "react";
import { useUser } from "../context/UseUser";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "./UserFavorite.css";

export default function UserFavorite() {
  const { user } = useUser();
  const { moviePick, setMoviePick } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const username = user ? user : sessionStorage.getItem("username");
    try {
      axios
        .get(`http://localhost:3001/favorite/getownfavorites`, {
          params: {
            username: username,
          },
        })
        .then((response) => {
          console.log("Movies fetched:", response.data);
          setMoviePick(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch movies:", error);
        });
    } catch (error) {
      console.error("Jokin meni pieleen", error);
    }
  }, [user, setMoviePick]);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      (prevIndex === 0 ? moviePick.length - 1 : prevIndex - 1)
    );
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === moviePick.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <div className="container_userfavorite">
        <div className="info_favorite">
          <h1>Omat suosikit</h1>
        </div>
        <div className="movieList">
          <div className="userfavorite_info">
            <h3>Elokuvat</h3>
          </div>
          <div className="container_poster">
            {moviePick
              .filter((movie) => movie.media_type === "movie")
              .map((movie, index) => (
                <div className={`poster ${index === currentIndex ? "active" : ""}`} key={index}>
                  {movie.poster_path && (
                    <Link to={`/movie/?id=${movie.id}`}>
                      {/*{movie.title ? (
                        <p>{movie.title}</p>
                      ) : movie.name ? (
                        <p>{movie.name}</p>
                      ) : (
                        <p>Ei nimeä saatavilla</p>
                      )} */}
                      <img
                        src={
                          "https://image.tmdb.org/t/p/w342/" + movie.poster_path
                        }
                        alt="Movie poster"
                      />
                      <div className="release_year">
                        {movie.release_date ? (
                          <p>{movie.release_date.split("-")[0]}</p>
                        ) : movie.first_air_date ? (
                          <p>{movie.first_air_date.split("-")[0]}</p>
                        ) : (
                          <p>Ei julkaisuvuotta</p>
                        )}
                      </div>
                      <div className="imdb_rating">
                        <span className="star">&#9733;</span>
                        <p>{movie.vote_average}</p>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            <button className="prev" onClick={handlePrevClick}>
              {"<"}
            </button>
            <button className="next" onClick={handleNextClick}>
              {">"}
            </button>
          </div>
        </div>
        <div className="movieList">
          <div className="userfavorite_info">
            <h3>Sarjat</h3>
          </div>
          <div className="container_poster">
            {moviePick
              .filter((movie) => movie.media_type === "tv")
              .map((movie, index) => (
                <div className="poster" key={index}>
                  {movie.poster_path && (
                    <Link to={`/movie/?id=${movie.id}`}>
                      {/*
                      {movie.title ? (
                        <p>{movie.title}</p>
                      ) : movie.name ? (
                        <p>{movie.name}</p>
                      ) : (
                        <p>Ei nimeä saatavilla</p>
                      )}
                      */}
                      <img
                        src={
                          "https://image.tmdb.org/t/p/w342/" + movie.poster_path
                        }
                        alt="TV Show poster"
                      />
                      <div className="release_year">
                        {movie.release_date ? (
                          <p>{movie.release_date.split("-")[0]}</p>
                        ) : movie.first_air_date ? (
                          <p>{movie.first_air_date.split("-")[0]}</p>
                        ) : (
                          <p>Ei julkaisuvuotta</p>
                        )}
                      </div>
                      <div className="imdb_rating">
                        <span className="star">&#9733;</span>
                        <p>{movie.vote_average}</p>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
