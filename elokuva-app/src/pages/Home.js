import React, { useEffect, useState } from "react";
import "./Home.css";
import axios from "axios";

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getRandomPosters = async () => {
      try {
        const response = await axios.get('http://localhost:3001/random_movies')
        setMovies(response.data)
      } catch (error) {
        console.error("Virhe satunnaisten postereiden haussa", error)
      }
    };
    getRandomPosters();
  }, []);

  const renderCardGroup = (startIndex) => (
    <div className="card-container">
      {movies.slice(startIndex, startIndex + 3).map((movie, index) => (
        <div key={index} className="homeposter" style={{ zIndex: 3 - index }}>
          <img
            src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
            alt={movie.title}
          />
        </div>
      ))}
    </div>
  );

  return (
<div className="home-container">
      <div><p className="frontText">Hae ja arvostele elokuvia!</p>{renderCardGroup(0)}</div>
      <div><p className="frontText">Selaa elokuvien näytösaikoja!</p>{renderCardGroup(3)}</div>
      <div><p className="frontText">Liity ryhmiin ja keskustele!</p>{renderCardGroup(6)}</div>
    </div>
  );
}