import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext"
import { useLocation } from 'react-router-dom';
import "./Home.css";
import axios from "axios";

export default function Home() {
  const { movies, setMovies, loading, setLoading } = useContext(UserContext)
  const location = useLocation();
  const [isHome, setIsHome] = useState(location.pathname === '/')

  useEffect(() => {
    setIsHome(location.pathname === '/')
  }, [location]);

  useEffect(() => {
    console.log('Effect running', { isHome, moviesLength: movies.length, loading });
    
    if (isHome && movies.length === 0 && !loading) {
      setLoading(true)
      axios.get("http://localhost:3001/random_movies/homepage")
        .then(response => {
          setMovies(response.data)
          setLoading(false)
        })
        .catch(error => {
          console.error("Virhe elokuvien haussa", error)
          setLoading(false)
        });
    }
  
    const handleVisibilityChange = () => {
      console.log("Dokumentin tila: ", document.visibilityState)
      if (document.visibilityState === 'hidden' && isHome) {
        console.log("Päivitetään kuvat taustalla...")
        setLoading(true);
        axios.get("http://localhost:3001/random_movies/homepage")
          .then(response => {
            setMovies(response.data)
            setLoading(false);
            console.log("Kuvat päivitetty taustalla")
          })
          .catch(error => {
            console.error("Virhe elokuvien haussa", error)
            setLoading(false);
          });
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange)
  
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    };
  }, [isHome, movies.length, loading, setLoading, setMovies])



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
      <div>
        <div className="frontText one">
          <p>Hae ja arvostele elokuvia!</p>
        </div>
        {renderCardGroup(0)}
      </div>
      <div>
        <div className="frontText two">
          <p>Selaa elokuvien näytösaikoja!</p>
        </div>
        {renderCardGroup(3)}
      </div>
      <div>
        <div className="frontText three">
          <p>Liity ryhmiin ja keskustele!</p>
        </div>
        {renderCardGroup(6)}
      </div>
    </div>
  );
}
