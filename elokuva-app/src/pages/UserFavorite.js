import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UseUser';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from "react-router-dom";
import './UserFavorite.css';

export default function UserFavorite() {
    const { user } = useUser()
    const { moviePick, setMoviePick } = useUser();
    
    useEffect(() => {
        const username = user ? user : sessionStorage.getItem('username')
        try {
          axios
            .get(`http://localhost:3001/favorite/getownfavorites`, {
              params: {
                username: username
              }
            })
            .then(response => {
              console.log('Movies fetched:', response.data)
              setMoviePick(response.data)
            })
            .catch(error => {
              console.error('Failed to fetch movies:', error)
            })
    
        } catch (error) {
          console.error('Jokin meni pieleen', error)
        }
      }, [user])


  return (
    <>
      <div className='container_userfavorite'>
        <div className='info_favorite'>
            <h3>Omat suosikit</h3>
        </div>
        <div className="movieList">
            {moviePick &&
            moviePick
                .filter((movie) => movie.poster_path !== null)
                .map((movie, index) => (
                <div className="poster" key={index}>
                    {movie.poster_path && (
                    <Link to={`/movie/?id=${movie.id}`}>
                        <p>{movie.title}</p>
                        <img
                        src={
                            "https://image.tmdb.org/t/p/w342/" + movie.poster_path
                        }
                        alt="Movie poster"
                        />
                        <div className='release_year'>
                            <p>{movie.release_date.split('-')[0]}</p>
                        </div>
                        <div className='imdb_rating'>
                            <span className="star">&#9733;</span>
                            <p>{movie.vote_average}</p>
                        </div>
                    </Link>
                    )}
                </div>
                ))}
        </div>
      </div>
    </>
  );
}
