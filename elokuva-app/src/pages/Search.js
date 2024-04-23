import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Search.css";
import { useUser } from "../context/UseUser";
import { useTheme } from '../context/ThemeContext';

export default function Search() {
  const { theme } = useTheme();
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

  useEffect(() => {
    console.log(movieData);
  }, [movieData]);

  const handleChange = (e) => {
    setMovieData((prevMovieData) => ({
      ...prevMovieData,
      [e.target.name]: e.target.value,
    }));
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

  useEffect(() => {
    console.log(filteredSearch)
  }, [filteredSearch]);

  const handleFilter = (e) => {
    setFilteredSearch((prevFilteredSearch) => ({
      ...prevFilteredSearch,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!movieData) {
      console.log("movieDataa ei ole");
    }

    console.log("Tämä on" + JSON.stringify(movieData));

    axios
      .post("http://localhost:3001/movies?query=", movieData)
      .then((response) => {
        if (response.data.length === 0){
          alert("Ei yhtään hakutulosta. Suorita uusi haku.")
        }
        console.log(JSON.stringify(response.data[8]), JSON.stringify(response.data[9]), JSON.stringify(response.data[10]) )
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

  const handleFilteredSearch = (event,name, value) => {
    event.preventDefault();
    console.log("tämä on value: ",name, value)
    const searchData = { ...filteredSearch, [name]: value };
    if (!filteredSearch) {
      console.log("Ei ole hakua");
    }
    console.log("Tämä on" + JSON.stringify(searchData));

    axios.post('http://localhost:3001/movies/filtered', searchData)
    .then(response => {
      console.log(response.data.length)
      if (response.data.length === 0){
        alert("Ei yhtään hakutulosta. Suorita uusi haku.")
      }
      setMoviePick(response.data);
      sessionStorage.setItem('moviePick', JSON.stringify(response.data))
    })
    .catch(error => {
        console.error('Error registering user:', error.response.data);
        alert("Virhe haussa...")
    })  
  };

  const handleFilteredSeries = (event,name,value) => {
    event.preventDefault();
    console.log("tämä on value: ",name, value)
    const searchData = { ...filteredSearch, [name]: value };
    if (!searchData) {
      console.log("Ei ole hakua");
    }

    console.log("Tämä on" + JSON.stringify(searchData));

    axios.post('http://localhost:3001/movies/series', searchData)
    .then(response => {
      console.log(response.data.length)
      if (response.data.length === 0){
        alert("Ei yhtään hakutulosta. Suorita uusi haku.")
      }
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
    <div className={`searchpage-container ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <div className = "search-type">
        <input type = "radio" name = "searchType" value = "basic" onClick={handleSearchType}/><span class="radio-label">Nimihaku</span>
        <input type = "radio" name = "searchType" value = "filtered" onClick={handleSearchType}/><span class="radio-label">Tarkempi elokuvahaku</span>
        <input type = "radio" name = "searchType" value = "filtered-series" onClick={handleSearchType}/><span class="radio-label">Tarkempi sarjahaku</span>
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
              <option value="" disabled selected>Hakutulosten laajuus</option>
              <option value="1">Normaali</option>
              <option value="4">Laajempi</option>
              <option value="8">Laajin</option>
          </select>
          <button type="submit" className = "searchButton">Haku</button>
        </form>
        )}

        {searchType === "filtered" && (
        <form className="filtered-search" onSubmit={handleFilteredSearch}>
          <div>
            
            <select name="genre" onChange={(e) => { handleFilter(e); handleFilteredSearch(e,e.target.name,e.target.value); }}>
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
            <select name="language" onChange={(e) => { handleFilter(e); handleFilteredSearch(e,e.target.name,e.target.value); }}>
              <option value="">Kaikki kielet</option>
              <option value="en">Englanti</option>
              <option value="fi">Suomi</option>
              <option value="sv">Ruotsi</option>
            </select>
          </div>
          <div> 
            <input name = "year" placeholder="julkaisuvuosi" onChange={handleFilter}/>
            <input name = "cast" placeholder= "näyttelijä" onChange={handleFilter}/>
            <button type="submit" className = "searchButton" >Haku</button>
          </div> 
          <div>
          <select name="sort" onChange={(e) => { handleFilter(e); handleFilteredSearch(e,e.target.name,e.target.value); }}>
              <option value="" disabled selected>Valitse järjestys</option>
              <option value="popularity.desc">Suosituin ensin</option>
              <option value="popularity.asc">Vähiten suosittu</option>
              <option value="title.asc">Nimen perusteella aakkoset</option>
              <option value="title.desc">Nimen perusteella toisinpäin</option>
              <option value="primary_release_date.asc">Vanhin ensin</option>
              <option value="primary_release_date.desc">Uusin ensin</option>
              <option value="revenue.desc">Suurin liikevaihto</option>

            </select>
            <select name="pages" onChange={(e) => { handleFilter(e); handleFilteredSearch(e,e.target.name,e.target.value); }}>
              <option value="" disabled selected>Hakutulosten laajuus</option>
              <option value="1">Normaali</option>
              <option value="4">Laajempi</option>
              <option value="8">Laajin</option>
            </select>
          </div> 
        </form>
        )}

        {searchType === "filtered-series" && (
        <form className="filtered-search" onSubmit={handleFilteredSeries}>
            <div>
            <select name="genre" onChange={(e) => { handleFilter(e); handleFilteredSeries(e,e.target.name,e.target.value); }}>
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
            <select name="language" onChange={(e) => { handleFilter(e); handleFilteredSeries(e,e.target.name,e.target.value); }}>
              <option value="">Kaikki kielet</option>
              <option value="en">Englanti</option>
              <option value="fi">Suomi</option>
              <option value="se">Ruotsi</option>
            </select>
            </div>
            <div>
              <input name = "year" placeholder="julkaisuvuosi" onChange={handleFilter}/>
              <button className = "searchButton" type="submit">Haku</button>
            </div>
            <div>
            <select name="sort" onChange={(e) => { handleFilter(e); handleFilteredSeries(e,e.target.name,e.target.value); }}>
              <option value="" disabled selected>Valitse järjestys</option>
              <option value="popularity.desc">Suosituin ensin</option>
              <option value="popularity.asc">Vähiten suosittu</option>              
              <option value="name.asc">Nimen perusteella aakkoset</option>
              <option value="name.desc">Nimen perusteella toisinpäin</option>
              <option value="first_air_date.asc">Vanhin ensin</option>
              <option value="first_air_date.desc">Uusin ensin</option>
            </select>
            <select name="pages" onChange={(e) => { handleFilter(e); handleFilteredSeries(e,e.target.name,e.target.value); }}>
              <option value="" disabled selected>Hakutulosten laajuus</option>
              <option value="1">Normaali</option>
              <option value="4">Laajempi</option>
              <option value="8">Laajin</option>
            </select>
            </div>
        </form>
        )}
      </div>
      <div className="movieList" ref={resultsRef}>
        {moviePick &&
          moviePick
            .filter(movie => movie.poster_path !== null)
            .map((movie, index) => (
            <div className="poster" key={index}>
              {/*<h2>{movie.title}</h2>*/}
              {movie.poster_path && (
                <Link to={`/movie/?id=${movie.id}`}>
                  {/*<Link to={`/movie/${(movie.title)}?poster=${(movie.poster_path)}/${(movie.id)}`}>*/}
                  <img
                    src={"https://image.tmdb.org/t/p/w342/" + movie.poster_path}
                    alt="Movie poster"
                  />
                </Link>
              )}
            </div>
          ))}
      </div>
    </div>
    </>
  );
}
