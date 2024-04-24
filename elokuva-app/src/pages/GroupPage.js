import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./GroupPage.css";
import axios from "axios";
import io from "socket.io-client";
import { useUser } from "../context/UseUser";
import { Link } from "react-router-dom";

const socket = io("http://localhost:3001");

export default function GroupPage() {
  let { groupName } = useParams();
  const { moviePick, setMoviePick } = useUser();
  const { isAdmin, user } = useUser();
  const [owner, setOwner] = useState("");
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [groupShowtimes, setGroupShowtimes] = useState([]);
  const [chat, setChat] = useState([]);
  const [showArrowsMovies, setShowArrowsMovies] = useState(false);
  const [showArrowsTV, setShowArrowsTV] = useState(false);
  const scrollMoviesRef = useRef(null);
  const scrollTVRef = useRef(null);

  groupName = decodeURIComponent(groupName);


  // ----- Alustetaan Socket yhteys -----
  useEffect(() => {
    socket.on("message", (message) => {
      setChat((prevChat) => [...prevChat, message]);
    });

    return () => socket.disconnect();
  }, []);


  // ----- Ryhmän omistajan + jäsenten haut -----
  useEffect(() => {
    axios
      .get(`http://localhost:3001/groups/owner?groupname=${groupName}`)
      .then((response) => {
        setOwner(response.data);
      })
      .catch((error) => {
        console.error("Fetching owner failed", error);
      });

      axios
      .get(`http://localhost:3001/getmembers/membersingroup?groupname=${groupName}`)
      .then((response) => {
        setMembers(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Fetching members failed", error);
      });

    socket.on("message", (message) => {
      setChat((prevChat) => [...prevChat, message]);
    });

    return () => {
      socket.off("message");
    };
  }, [groupName]);


  // ----- Ryhmänchat -----
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("sendMessage", { text: message, groupName, sender: user });
      setMessage("");
    }
  };


  // ----- Suosikkielokuvat ja -sarjat -----
  useEffect(() => {
    const gname = groupName;
    try {
      axios
        .get(`http://localhost:3001/favorite/getgroupfavorites`, {
          params: {
            groupname: gname,
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
  }, [setMoviePick, groupName]);


  // ----- Ryhmän näytösaikojen haku -----
  useEffect(() => {
      axios
      .get(`http://localhost:3001/groupST/getgrouptimes?groupname=${groupName}`)
      .then((response) => {
        setGroupShowtimes(response.data);
        console.log("Tänne ryhmän ajat: ", response.data);
      })
      .catch((error) => {
        console.error("Fetching showtimes failed", error);
      });
  }, [groupName]);



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
  }, [moviePick, showArrowsMovies, showArrowsTV]);


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


  // ----- Id ja sitä vastaava kaupunki -----
  const theatreToCity = {
    "1056": "Espoo",
    "1039": "Pori",
    "1038": "Helsinki",
    "1058": "Helsinki",
    "1034": "Helsinki",
    "1047": "Helsinki",
    "1043": "Vantaa",
    "1044": "Jyväskylä",
    "1049": "Kuopio",
    "1042": "Lahti",
    "1052": "Lappeenranta",
    "1036": "Oulu",
    "1037": "Tampere",
    "1040": "Tampere",
    "1059'": "Turku",
    "1035": "Turku"
  };

  return (
    <>
      {user ? (
      <div className="container_grouppage">
        <div className="group_info">
          <div className="group_name">
            <h1>{groupName}</h1>
          </div>
          <div className="group_members">
            <div className="group_owner">
              <p>
                <strong>Ryhmän perustaja: </strong>
                {owner}
              </p>
            </div>
            <div className="other_members">
              <div className="other_members_infotext">
                <p>
                  <strong>Jäsenet:</strong>
                </p>
              </div>
              <div className="other_members_list">
                {members &&
                  members.map((member, index) =>
                    member.username !== owner ? (
                      <div key={index}>
                        <p>{member.username}</p>
                      </div>
                    ) : null
                  )}
              </div>
            </div>
          </div>
        </div>
        <div className="group_favorites">
          <div className="movieList">
            {showArrowsMovies && (
              <button className="prev" onClick={scrollLeft(scrollMoviesRef)}>
                {"<"}
              </button>
            )}
            <div className="userfavorite_info">
              <h3>Ryhmän elokuvat</h3>
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
              <h3>Ryhmän sarjat</h3>
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
            {showArrowsTV && (
              <button className="next" onClick={scrollRight(scrollTVRef)}>
                {">"}
              </button>
            )}
          </div>
            <div className="list_showtimes">
              <div className="info_showtimes">
                <h3>Tallennetut näytösajat</h3>
              </div>
              <div className="container_groupshowtimes">
                {groupShowtimes &&
                  groupShowtimes
                  .filter(showtime => {
                    //Tarkistetaan, onko näytöksen päivämäärä jo mennyt
                    const showtimeDate = new Date(showtime.showdate);
                    const currentDate = new Date();
                    return showtimeDate >= currentDate;
                  })
                  .map((showtime, index) => 
                    <div className="content_showtimes" key={index}>
                      <div className="img_showtime">
                        <img src={showtime.img} alt="" />
                      </div>
                      <div className="showtime_data">
                        <p>{showtime.movietitle}</p>
                        <p>{theatreToCity[showtime.theatreid]}</p>
                        <p>{showtime.showdate.substr(0, 10)}</p>
                        <p>{showtime.showstarttime.substr(0, 5)}</p>
                      </div>
                    </div>
                  )}
              </div>
          </div>
          <div className="group_chat">
            <h2>Chat</h2>
            {chat.map((msg, index) => (
              <p key={index}>
                {msg.sender}: {msg.text}
              </p>
            ))}
            <form onSubmit={sendMessage}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Kirjoita viesti..."
              />
              <button type="submit">Lähetä</button>
            </form>
          </div>
        </div>
        <div className="buttonToAdminPage">
          {isAdmin && user === owner && (
            <Link to="/adminpage">
              <button>Ryhmän ylläpitosivuille</button>
            </Link>
          )}
        </div>
      </div>
      ) : (<h1>Sivua ei löytynyt</h1>)}
    </>
  )
}
