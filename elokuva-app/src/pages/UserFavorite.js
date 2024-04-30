import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../context/UseUser";
import axios from "axios";
import { Link } from "react-router-dom";
import "./UserFavorite.css";

export default function UserFavorite() {
  const { user } = useUser();
  const { moviePick, setMoviePick } = useUser();
  const [showArrowsMovies, setShowArrowsMovies] = useState(false);
  const [showArrowsTV, setShowArrowsTV] = useState(false);
  const scrollMoviesRef = useRef(null);
  const scrollTVRef = useRef(null);

  // ----- Suosikkien haku -----
  useEffect(() => {
    const username = user ? user : sessionStorage.getItem("username");
    try {
      axios
        .get(`/favorite/getownfavorites`, {
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

  // ----- Nuolinäppäimet piiloon, mikäli ei scrollattavaa -----
  useEffect(() => {
    const checkOverflow = (ref, setShowArrows) => {
      const container = ref.current;
      if (container) {
        const hasOverflow = container.scrollWidth > container.clientWidth;
        setShowArrows(hasOverflow);
      }
    };

    checkOverflow(scrollMoviesRef, setShowArrowsMovies);
    checkOverflow(scrollTVRef, setShowArrowsTV);

    window.addEventListener("resize", () => {
      checkOverflow(scrollMoviesRef, setShowArrowsMovies);
      checkOverflow(scrollTVRef, setShowArrowsTV);
    });

    return () => {
      window.removeEventListener("resize", () => {
        checkOverflow(scrollMoviesRef, setShowArrowsMovies);
        checkOverflow(scrollTVRef, setShowArrowsTV);
      });
    };
  }, [moviePick]);

  // ----- Nuolinäppäimille funktiot -----
  const scrollRight = (ref) => () => {
    let container = ref.current;
    if (!container) return;

    let currentScrollPosition = container.scrollLeft + container.clientWidth; // nykyinen skrollaus sijainti konteinerin sisällä
    let maxScrollableWidth = container.scrollWidth; // maksimi skrollaus leveys

    // Etsitään ensimmäinen täysin piilossa oleva posteri
    const posters = container.querySelectorAll(".content_poster");
    let found = false;
    for (let poster of posters) {
      let posterEnd = poster.offsetLeft + poster.offsetWidth;
      if (posterEnd > currentScrollPosition) {
        // posterin loppu on pidemmällä kuin nykyinen skrollaus sijainti
        container.scrollTo({
          left:
            poster.offsetLeft -
            (container.offsetWidth - poster.offsetWidth) / 2,
          behavior: "smooth",
        });
        found = true;
        break;
      }
    }

    // Jos ei löydetty yhtään piilossa olevaa posteria, mutta skrollaus ei ole vielä maksimissaan, skrollataan loppuun
    if (
      !found &&
      container.scrollLeft + container.clientWidth < maxScrollableWidth
    ) {
      container.scrollTo({
        left: maxScrollableWidth - container.clientWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollLeft = (ref) => () => {
    let container = ref.current;
    if (!container) return;

    let currentScrollPosition = container.scrollLeft; // nykyinen skrollaus sijainti konteinerin sisällä

    // Etsitään ensimmäinen täysin piilossa oleva posteri vasemmalle suuntaan
    const posters = Array.from(
      container.querySelectorAll(".content_poster")
    ).reverse();
    let found = false;
    for (let poster of posters) {
      let posterStart = poster.offsetLeft;
      if (posterStart < currentScrollPosition) {
        // posterin alku on ennen nykyistä skrollaus sijaintia
        container.scrollTo({
          left: posterStart - (container.offsetWidth - poster.offsetWidth) / 2,
          behavior: "smooth",
        });
        found = true;
        break;
      }
    }

    // Jos ei löydetty yhtään piilossa olevaa posteria vasemmalta, mutta skrollaus ei ole vielä nollassa, skrollataan alkuun
    if (!found && container.scrollLeft > 0) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="container_userfavorite">
        <div className="info_favorite">
          <h1>Omat suosikit</h1>
        </div>
        <div className="movieList">
          {showArrowsMovies && (
            <button className="prev" onClick={scrollLeft(scrollMoviesRef)}>
              {"<"}
            </button>
          )}
          <div className="userfavorite_info">
            <h3>Elokuvat</h3>
          </div>
          <div className="container_poster" ref={scrollMoviesRef}>
            {moviePick &&
              moviePick.length > 0 &&
              moviePick
                .filter((movie) => movie.media_type === "movie")
                .map((movie, index) => (
                  <div className="content_poster" key={index}>
                    {movie.poster_path && (
                      <Link to={`/movie/?id=${movie.id}`}>
                        <div className="img_poster">
                          <img
                            src={
                              "https://image.tmdb.org/t/p/w342/" +
                              movie.poster_path
                            }
                            alt="Movie poster"
                          />
                        </div>
                        <div className="year_imdbrating">
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
                        </div>
                        <div className="movie_title">
                          {movie.title ? (
                            <p>{movie.title}</p>
                          ) : movie.name ? (
                            <p>{movie.name}</p>
                          ) : (
                            <p>Ei nimeä saatavilla</p>
                          )}
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
          </div>
          {showArrowsMovies && (
            <button className="next" onClick={scrollRight(scrollMoviesRef)}>
              {">"}
            </button>
          )}
        </div>
        <div className="movieList">
          {showArrowsTV && (
            <button className="prev" onClick={scrollLeft(scrollTVRef)}>
              {"<"}
            </button>
          )}
          <div className="userfavorite_info">
            <h3>Sarjat</h3>
          </div>
          <div className="container_poster" ref={scrollTVRef}>
            {moviePick &&
              moviePick.length > 0 &&
              moviePick
                .filter((movie) => movie.media_type === "tv")
                .map((movie, index) => (
                  <div className="content_poster" key={index}>
                    {movie.poster_path && (
                      <Link to={`/movie/?id=${movie.id}`}>
                        <div className="img_poster">
                          <img
                            src={
                              "https://image.tmdb.org/t/p/w342/" +
                              movie.poster_path
                            }
                            alt="TV Show poster"
                          />
                        </div>
                        <div className="year_imdbrating">
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
                        </div>
                        <div className="movie_title">
                          {movie.title ? (
                            <p>{movie.title}</p>
                          ) : movie.name ? (
                            <p>{movie.name}</p>
                          ) : (
                            <p>Ei nimeä saatavilla</p>
                          )}
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
          </div>
          {showArrowsTV && (
            <button className="next" onClick={scrollRight(scrollTVRef)}>
              {">"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
