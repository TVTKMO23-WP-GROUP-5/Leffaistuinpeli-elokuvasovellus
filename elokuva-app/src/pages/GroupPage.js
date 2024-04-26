import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./GroupPage.css";
import axios from "axios";
import { useUser } from "../context/UseUser";
import { Link } from "react-router-dom";

export default function GroupPage() {
  let { groupName } = useParams();
  const { moviePick, setMoviePick } = useUser();
  const { isAdmin, user } = useUser();
  const [isMember, setIsMember] = useState(false)
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


  // ----- Tarkistaa onko käyttäjä jäsen -----
  useEffect(() => {
    const uname = user ? user : sessionStorage.getItem("username")
    axios
      .get(process.env.REACT_APP_URL + `/getmembers/isgroupmember?username=${uname}&groupname=${groupName}`)
      .then((response) => {
        setIsMember(response.data)
      })
      .catch((error) => {
        console.error("Checking status failed", error);
      });
  }, [])



  // ----- Ryhmän omistajan + jäsenten haut -----
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_URL + `/groups/owner?groupname=${groupName}`)
      .then((response) => {
        setOwner(response.data);
      })
      .catch((error) => {
        console.error("Fetching owner failed", error);
      });

    axios
      .get(
        process.env.REACT_APP_URL + `/getmembers/membersingroup?groupname=${groupName}`
      )
      .then((response) => {
        setMembers(response.data);
      })
      .catch((error) => {
        console.error("Fetching members failed", error);
      });
  }, [groupName]);

  // ----- Suosikkielokuvat ja -sarjat -----
  useEffect(() => {
    const gname = groupName;
    try {
      axios
        .get(process.env.REACT_APP_URL + `/favorite/getgroupfavorites`, {
          params: {
            groupname: gname,
          },
        })
        .then((response) => {
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
      .get(process.env.REACT_APP_URL + `/groupST/getgrouptimes?groupname=${groupName}`)
      .then((response) => {
        setGroupShowtimes(response.data);
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
    1056: "Espoo",
    1039: "Pori",
    1038: "Helsinki",
    1058: "Helsinki",
    1034: "Helsinki",
    1047: "Helsinki",
    1043: "Vantaa",
    1044: "Jyväskylä",
    1049: "Kuopio",
    1042: "Lahti",
    1052: "Lappeenranta",
    1036: "Oulu",
    1037: "Tampere",
    1040: "Tampere",
    "1059'": "Turku",
    1035: "Turku",
  };


  // ----- Ryhmän chat -----

  // Viestin lähetys
  const handleMsg = async (event) => {
    event.preventDefault();

    const username = user;
    const gname = groupName;
    const msg = message.trim();

    if (!msg) return; // Estää tyhjät viestit

   axios.post(process.env.REACT_APP_URL + `/groupMsg/sendmsg`, {
        username: username,
        groupname: gname,
        msg: msg
      })
      .then((response) => {
        setChat(previousMessages => [{username, msg, msgtime: new Date().toISOString()}, ...previousMessages]);
        setMessage('')
      })
      .catch((error) => {
      console.error("Sending message failed!", error)
      })
  };

  // Viestien vastaanottaminen
  useEffect (() => {
    const gname = groupName;

    axios.get(process.env.REACT_APP_URL + `/groupMsg/getmsg?groupname=${gname}`)
    .then((response) => {
      setChat(response.data.reverse())
    })
    .catch((error) => {
      console.error(error)
    })
  }, [groupName])



  // ----- Aika muunnetaan suomen aikaan -----
  const finTime = (time) => {
    const utcTimetamp = time;

    const date = new Date(utcTimetamp);

    const finnishTime = date.toLocaleString("fi-FI", { timeZone: "Europe/Helsinki" })

    return finnishTime.substring(0, 15);
  }

  const toFinnishTime = (utcDate) => {
    const date = new Date(utcDate);
    return date.toLocaleString("fi-FI", { timeZone: "Europe/Helsinki" });
  };

  return (
    <>
      {user && isMember ? (
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
          <div className="buttonToAdminPage">
            {isAdmin && user === owner && (
              <Link to="/adminpage">
                <button>Ryhmän ylläpitosivuille</button>
              </Link>
            )}
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
                    .filter((showtime) => {
                      //Tarkistetaan, onko näytöksen päivämäärä jo mennyt
                      const showtimeDate = new Date(showtime.showdate);
                      const currentDate = new Date();
                      return showtimeDate >= currentDate;
                    })
                    .map((showtime, index) => (
                      <div className="content_showtimes" key={index}>
                        <div className="img_showtime">
                          <img src={showtime.img} alt="" />
                        </div>
                        <div className="showtime_data">
                          <p>{showtime.movietitle}</p>
                          <p>{theatreToCity[showtime.theatreid]}</p>
                          <p>{toFinnishTime(showtime.showdate).substr(0, 10)}</p>
                          <p>{showtime.showstarttime.substr(0,5)}</p>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
            <div className="container_chat">
              <div className="info_chat">
                <h3>Chat</h3>
              </div>
              <div className="content_chat">
                <div className="display_chat">
                  {chat.map((msg, index) => ( 
                    <div className="msgs">
                      <div className="msgs_msg">
                        <p key={index}>
                          <strong>{msg.username}:</strong> {msg.msg}
                        </p>
                      </div>
                      <div className="msgs_time">
                        <em>{finTime(msg.msgtime)}</em>
                      </div>
                    </div>
                  ))} 
                </div>
                <div className="messaging">
                  <form onSubmit={handleMsg}>
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
            </div>
          </div>
          
        </div>
      ) : (
        <h1 style={ {marginTop: '4em'} }>Ei oikeuksia</h1>
      )}
    </>
  );
}
