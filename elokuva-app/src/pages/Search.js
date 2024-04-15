import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Search.css";
import { useUser } from "../context/UseUser";

export default function Search() {
  const [movieData, setMovieData] = useState({ 
    search: "",
    pages: "1" 
  });
  const [filteredSearch, setFilteredSearch] = useState({
    year: "",
    sort: "",
    cast: "",
    genre: "",
    language: "", 
    pages: "1"
  })
  const { moviePick, setMoviePick } = useUser();
  const [searchType, setSearchType] = useState("basic")
  const resultsRef = useRef(null);

  useEffect(() => {
    setMoviePick(null);
  }, [setMoviePick]);

  const handleChange = (e) => {
    setMovieData((prevMovieData) => ({
      ...prevMovieData,
      [e.target.name]: e.target.value,
    }));
    console.log(movieData);
  };

  const handleSearchType = (e) => {
    setSearchType(e.target.value)
    setFilteredSearch({
      year: "",
      sort: "",
      cast: "",
      genre: "",
      language: "", 
      pages: "1"
    })
    setMovieData({ 
      search: "",
      pages: "1" 
    })
    console.log(searchType)
  }

  const handleFilter = (e) => {
    setFilteredSearch((prevFilteredSearch) => ({
      ...prevFilteredSearch,
      [e.target.name]: e.target.value,
    }))
    console.log(filteredSearch)
  }

// ---------- YLEISHAKU --------------------//
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!movieData) {
      console.log("movieDataa ei ole");
    }

    console.log("Tämä on" + JSON.stringify(movieData));

    axios
      .post("http://localhost:3001/movies?query=", movieData)
      .then((response) => {
        setMoviePick(response.data);
        sessionStorage.setItem('moviePick', JSON.stringify(response.data))
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: "smooth" });
        }
        /*setMoviePick(
          "https://image.tmdb.org/t/p/w342/" + response.data[0].poster_path
        );*/
      })
      .catch((error) => {
        alert("Haku epäonnistui jostain syystä");
      });
  };
// ---------- TARKENNETTU LEFFAHAKU --------------------//
  const handleFilteredSearch = (event) => {
    event.preventDefault();

    if (!filteredSearch) {
      console.log("Ei ole hakua");
    }

    console.log("Tämä on" + JSON.stringify(filteredSearch));

    axios.post('http://localhost:3001/movies/filtered', filteredSearch)
    .then(response => {
      console.log(response.data.length)
      setMoviePick(response.data);
      sessionStorage.setItem('moviePick', JSON.stringify(response.data))
    })
    .catch(error => {
        console.error('Error registering user:', error.response.data);
        alert("Virhe haussa...")
    })  

  };

// ---------- TARKENNETTU SARJAHAKU --------------------//
  const handleFilteredSeries = (event) => {
    event.preventDefault();

    if (!filteredSearch) {
      console.log("Ei ole hakua");
    }

    console.log("Tämä on" + JSON.stringify(filteredSearch));

    axios.post('http://localhost:3001/movies/series', filteredSearch)
    .then(response => {
      console.log(response.data.length)
      setMoviePick(response.data);
      sessionStorage.setItem('moviePick', JSON.stringify(response.data))
    })
    .catch(error => {
        console.error('Error registering user:', error.response.data);
        alert("Virhe haussa...")
    })  

  };


  return (
    <>
    <div className="searchpage-container">
      <div className = "search-type">
        <input type = "radio" name = "searchType" value = "basic" onClick={handleSearchType}/><span class="radio-label">Haku</span>
        <input type = "radio" name = "searchType" value = "filtered" onClick={handleSearchType}/><span class="radio-label">Elokuvahaku</span>
        <input type = "radio" name = "searchType" value = "filtered-series" onClick={handleSearchType}/><span class="radio-label">Sarjahaku</span>
      </div>
      <div className = "search-bars"> 
        {searchType === "basic" && (
        <form className="name-search" onSubmit={handleSubmit}>
          <input
            type="text"
            name="search"
            placeholder="Hae elokuvia tai sarjoja"
            onChange={handleChange}
          />
          <select name="pages" onChange={handleChange}>
            <option value="1">Pieni haku</option>
            <option value="4">Keskimääräinen haku</option>
            <option value="8">Suuri haku</option>
          </select>
          <button type="submit">Haku</button>
        </form>
        )}

        {searchType === "filtered" && (
        <form className="filtered-search" onSubmit={handleFilteredSearch}>
            <input name = "year" placeholder="julkaisuvuosi" onChange={handleFilter}/>
            <input name = "cast" placeholder= "näyttelijä" onChange={handleFilter}/>
            <button type="submit">Haku</button>
            <select name="genre" onChange={(e) => { handleFilter(e); handleFilteredSearch(e); }}>
              <option value = "">Genre</option>
              <option value="28">Toiminta</option>
              <option value="12">Seikkailu</option>
              <option value="16">Animaatio</option>
              <option value="35">Komedia</option>
              <option value="80">Rikos</option>
              <option value="99">Dokumentti</option>
              <option value ="18">Draama</option>
              <option value="10751">Perhe</option>
              <option value="14">Fantasia</option>
              <option value="36">Historia</option>
              <option value="27">Kauhu</option>
              <option value="10402">Musiikki</option>
              <option value="9648">Mysteeri</option>
              <option value="10749">Romanssi</option>
              <option value="878">Scifi</option>
              <option value="10770">TV Movie</option>
              <option value="53">Trilleri</option>
              <option value="10752">Sota</option>
              <option value="37">Western</option>
            </select>
            <select name="sort" onChange={(e) => { handleFilter(e); handleFilteredSearch(e); }}>
              <option value="title.asc">Nimi (nouseva)</option>
              <option value="title.desc">Nimi (laskeva)</option>
              <option value="popularity.asc">Suosio (nouseva)</option>
              <option value="popularity.desc">Suosio (laskeva)</option>
              <option value="primary_release_date.asc">Julkaisuvuosi (nouseva)</option>
              <option value="primary_release_date.desc">Julkaisuvuosi (laskeva)</option>
            </select>
            <select name="language" onChange={(e) => { handleFilter(e); handleFilteredSearch(e); }}>
              <option value="">Kaikki kielet</option>
              <option value="en">Englanti</option>
              <option value="fi">Suomi</option>
              <option value="sv">Ruotsi</option>
            </select>
            <select name="pages" onChange={(e) => { handleFilter(e); handleFilteredSearch(e); }}>
              <option value="1">Pieni haku</option>
              <option value="4">Keskimääräinen haku</option>
              <option value="8">Suuri haku</option>
            </select>
        </form>
        )}

        {searchType === "filtered-series" && (
        <form className="filtered-search" onSubmit={handleFilteredSeries}>
            <input name = "year" placeholder="julkaisuvuosi" onChange={handleFilter}/>
            <button type="submit">Haku</button>
            <select name="genre" onChange={(e) => { handleFilter(e); handleFilteredSeries(e); }}>
              <option value = "">Genre</option>
              <option value="10759">Toiminta ja seikkailu</option>
              <option value="16">Animaatio</option>
              <option value="35">Komedia</option>
              <option value="80">Rikos</option>
              <option value="99">Dokumentti</option>
              <option value="18">Draama</option>
              <option value="10751">Perhe</option>
              <option value="10762">Lapset</option>
              <option value="9648">Mysteeri</option>
              <option value="10763">Uutiset</option>
              <option value="10764">Tosi-tv</option>
              <option value="10765">Scifi</option>
              <option value="10766">Saippua</option>
              <option value="10767">Talk</option>
              <option value="10768">Sota ja politiikka</option>
              <option value="37">Western</option>
            </select>
            <select name="language" onChange={(e) => { handleFilter(e); handleFilteredSeries(e); }}>
              <option value="">Kaikki kielet</option>
              <option value="en">Englanti</option>
              <option value="fi">Suomi</option>
              <option value="se">Ruotsi</option>
            </select>
            <select name="sort" onChange={(e) => { handleFilter(e); handleFilteredSeries(e); }}>
              <option value="name.asc">Nimi (123abc...)</option>
              <option value="name.desc">Nimi (öäå...)</option>
              <option value="popularity.desc">Suosio (suosituin ensin)</option>
              <option value="popularity.asc">Suosio (käänteinen)</option>
              <option value="first_air_date.asc">Ensiesiintyminen (uusimmat)</option>
              <option value="first_air_date.desc">Ensiesiintyminen (vanhimmat)</option>
            </select>
            <select name="pages" onChange={(e) => { handleFilter(e); handleFilteredSeries(e); }}>
              <option value="1">Pieni haku</option>
              <option value="4">Keskimääräinen haku</option>
              <option value="8">Suuri haku</option>
            </select>
        </form>
        )}
      </div>
      <div className="movieList" ref={resultsRef}>
        {moviePick &&
          moviePick.map((movie, index) => (
            <div className="poster" key={index}>
              {/*<h2>{movie.title}</h2>*/}
              {movie.poster_path ? (
                <Link to={`/movie/?id=${movie.id}`}>
                  {/*<Link to={`/movie/${(movie.title)}?poster=${(movie.poster_path)}/${(movie.id)}`}>*/}
                  <img
                    src={"https://image.tmdb.org/t/p/w342/" + movie.poster_path}
                    alt="Movie poster"
                  />
                </Link>
              ) : null}
            </div>
          ))}
      </div>
    </div>
    </>
  );
}
