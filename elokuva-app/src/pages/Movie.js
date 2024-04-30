import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Movie.css";
import axios from "axios";
import { useUser } from "../context/UseUser";
export default function Movie() {
  const { user, moviePick, setMoviePick, userGroups, setRatingsList } =
    useUser();
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [ratingData, setRatingData] = useState({
    idmovie: "",
    media_type: "",
    username: user ? user.username : "",
    stars: 0,
    description: "",
  });
  const [favoriteData, setFavoriteData] = useState({
    idmovie: "",
    username: user ? user.username : "",
    media_type: "",
  });
  const [groupFavoriteData, setGroupFavoriteData] = useState({
    idmovie: "",
    groupname: "",
    media_type: "",
  });
  const [pickedObject, setPickedObject] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [stars, setStars] = useState(0);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      if (moviePick && moviePick.length > 0) {
        const foundMovie = moviePick.find(
          (m) => m.id.toString() === id.toString()
        );
        if (foundMovie) {
          setPickedObject(foundMovie);
          setRatingData((prev) => ({
            ...prev,
            idmovie: foundMovie.id,
            media_type: foundMovie.type,
            username: user ? user.username : "",
          }));
        }
      } else {
        const storedMoviePick = sessionStorage.getItem("moviePick");
        if (storedMoviePick) {
          const parsedMoviePick = JSON.parse(storedMoviePick);
          setMoviePick(parsedMoviePick);
          const foundMovie = parsedMoviePick.find(
            (m) => m.id.toString() === id
          );
          if (foundMovie && active) {
            setPickedObject(foundMovie);
            setRatingData((prev) => ({
              ...prev,
              idmovie: foundMovie.id,
              media_type: foundMovie.type,
              username: user ? user.username : "",
            }));
          }
        }
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [id, user]);

  // ----- Suosikkeihin lisäys -----
  const addToFavorite = async (event) => {
    event.preventDefault();

    const uname = sessionStorage.getItem("username");

    const updatedFavoriteData = {
      ...favoriteData,
      idmovie: pickedObject ? pickedObject.id : "",
      username: user ? user : uname,
      media_type: pickedObject ? pickedObject.type : "",
    };

    console.log(updatedFavoriteData);

    setFavoriteData(updatedFavoriteData);

    await axios
      .post("/favorite/addfavorite", updatedFavoriteData)
      .then((response) => {
        if (response.data.message === "success") {
          console.log("Added favorite successfully:", response.data);
          alert("Lisätty omiin suosikkeihin");
        } else if (response.data.message === "duplicate") {
          console.log("Something went wrong:", response.data);
          alert("Elokuva löytyy jo suosikeistasi!");
        } else {
          console.log("Something went wrong:", response.data);
          alert("Suosikin lisääminen epäonnistui...");
        }
      })
      .catch((error) => {
        console.error("Error adding favorite:", error.response.data);
        alert("Virhe suosikin lisäämisessä...");
      });
  };

  // ----- Ryhmän suosikkeihin lisäys ------
  const addToGroupFavorite = async (e) => {
    e.preventDefault();

    if (selectedGroup) {
      const updatedGroupFavoriteData = {
        ...groupFavoriteData,
        idmovie: pickedObject ? pickedObject.id : "",
        groupname: selectedGroup,
        media_type: pickedObject ? pickedObject.type : "",
      };

      setGroupFavoriteData(updatedGroupFavoriteData);

      await axios
        .post("/favorite/addgroupfavorite", updatedGroupFavoriteData)
        .then((response) => {
          if (response.data.message === "success") {
            console.log("Added favorite successfully:", response.data);
            alert("Lisätty ryhmän suosikkeihin");
          } else if (response.data.message === "duplicate") {
            console.log("Something went wrong:", response.data);
            alert("Elokuva löytyy jo ryhmäsi suosikeista!");
          } else {
            console.log("Something went wrong:", response.data);
            alert("Suosikin lisääminen epäonnistui...");
          }
        })
        .catch((error) => {
          console.error("Error adding favorite:", error.response.data);
          alert("Virhe suosikin lisäämisessä...");
        });
    } else {
      alert("Valitse ensin ryhmä!");
    }
  };

  const handleGroupSelect = (e) => {
    setSelectedGroup(e.target.value);
  };

  const handleRating = (rate) => {
    const newRating = rate;
    setRatingData((prev) => ({ ...prev, stars: newRating }));
    setStars(newRating);
    setHoverRating(newRating);
  };

  const handleMouseOver = (rate) => {
    setHoverRating(rate);
  };

  const handleMouseLeave = () => {
    setHoverRating(ratingData.stars);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRatingData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(ratingData);
  };

  // ----- Arvostelun lisääminen -----
  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("/rating/addRating", ratingData)
      .then((response) => {
        if (response.data.message === "success") {
          console.log("Rating registered successfully:", response.data);
          alert("Arvostelun luominen onnistui");
          axios
            .get("/rating/getrating")
            .then((response) => {
              setRatingsList(response.data);
            })
            .catch((error) => {
              console.error("Error adding favorite:", error);
              alert("Virhe arvostelujen lataamisessa.");
            });
          resetReviewForm();
        } else {
          console.log("Something went wrong:", response.data);
          alert("Arvostelun luominen epäonnistui...");
        }
      })
      .catch((error) => {
        console.error("Error registering rating:", error.response.data);
        alert("Virhe arvostelun luomisessa...");
      });
  };

  const resetReviewForm = () => {
    setRatingData({
      idmovie: ratingData.idmovie,
      media_type: "",
      username: ratingData.username,
      stars: 0,
      description: "",
    });
    setStars(0);
    setHoverRating(0);
  };

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setRatingData((prev) => ({ ...prev, username: storedUsername }));
    }
  }, []);

  return (
    <>
      {pickedObject ? (
        <div className="poster-container">
          <h3 className="title">
            {pickedObject.title ? pickedObject.title : null}
          </h3>
          <div className="movie_poster">
            {pickedObject.poster_path ? (
              <div>
                <img
                  src={
                    "https://image.tmdb.org/t/p/w342/" +
                    pickedObject.poster_path
                  }
                  alt="Movie poster"
                />
              </div>
            ) : null}
          </div>
          <div className="movie_container">
            <p className="overview">
              {pickedObject.overview ? pickedObject.overview : null}
            </p>
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
      {user && (
        <div className="ratings">
          <form>
            <div className="add_to_favorite">
              <div className="favorite_text">
                <p>
                  <strong>Lisää omiin suosikkeihin</strong>
                </p>
                <p>
                  <strong>Lisää ryhmän suosikkeihin</strong>
                </p>
              </div>
              <div className="favorite_buttons">
                <button type="button" onClick={(e) => addToFavorite(e)}>
                  <span className="heart">&hearts;</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowGroupDropdown(!showGroupDropdown)}
                >
                  <span className="heart">&hearts;</span>
                </button>
              </div>
            </div>
          </form>
          {showGroupDropdown && (
            <div className="dropdown_and_button">
              <select
                className="select_group_dropdown"
                onChange={handleGroupSelect}
                value={selectedGroup}
              >
                <option value="">Valitse ryhmä</option>
                {userGroups.map((group, index) => (
                  <option key={index} value={group.name}>
                    {group.name}
                  </option>
                ))}
              </select>
              <button onClick={(e) => addToGroupFavorite(e)}>
                Lisää suosikkeihin
              </button>
            </div>
          )}
          <h2>Arvostele katsomasi elokuva tai sarja!</h2>
          <form onSubmit={handleSubmit}>
            <div className="stars" onMouseLeave={handleMouseLeave}>
              {[1, 2, 3, 4, 5].map((star, index) => {
                return (
                  <button
                    type="button"
                    id="movieButton"
                    key={star}
                    className={star <= hoverRating ? "on" : "off"}
                    onClick={() => handleRating(star)}
                    onMouseOver={() => handleMouseOver(star)}
                  >
                    <span className="star">&#9733;</span>
                  </button>
                );
              })}
            </div>
            <textarea
              className="rating_description"
              type="text"
              name="description"
              placeholder="Mitä pidit?"
              value={ratingData.description}
              onChange={handleChange}
            />
            <button type="submit" className="continue">
              Jatka
            </button>
          </form>
        </div>
      )}
    </>
  );
}
