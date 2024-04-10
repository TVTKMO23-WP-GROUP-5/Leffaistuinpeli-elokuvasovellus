import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './Movie.css'
import axios from 'axios'
import { useUser } from "../context/UseUser";


export default function Movie() {
  const { moviePick } = useUser();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const posterPath = queryParams.get('poster')
  const id = queryParams.get('id')
  const title = decodeURIComponent(location.pathname.split('/movie')[1]).replace(/^\//, '');

  
  console.log(id)
  console.log(moviePick)

  const pickedObject = moviePick.find((m) => m.id.toString === id.toString)
  console.log(pickedObject)


  return (
    <div className='movie_container'>
      <h3>{title.trim()}</h3>
      {posterPath ? (
                <img
                  src={"https://image.tmdb.org/t/p/w342/" + posterPath}
                  alt="Movie poster"
                />
              ) : null}
      <div>
        
      </div>
    </div>
  )
}
