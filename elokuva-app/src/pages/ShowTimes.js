import React, { useState, useEffect, useRef } from "react";
import "./ShowTimes.css";
import axios from "axios";
import xml2js from "xml-js";
import { useUser } from "../context/UseUser";

export default function Showtimes() {
  const { user, userGroups } = useUser();
  const [showtimes, setShowtimes] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null)
  const [filter, setFilter] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('')
  const [activeIndex, setActiveIndex] = useState(null)
  const resultsRef = useRef(null);
  const [showtimeData, setShowtimeData] = useState({
    groupname: "",
    theatreid: "",
    showdate: "",
    movieid: "",
    movietitle: "",
    showstarttime: "",
    img: ""
  })

  useEffect(() => {
    if (!filter || !date) {
      console.log(
        "showtimes"
      );
      return;
    }

    setIsLoading(true);

    axios
      .get(`https://www.finnkino.fi/xml/Schedule/?area=${filter}&dt=${date}`, {
        responseType: "text",
      })
      .then((response) => {
        const result = xml2js.xml2js(response.data, { compact: true });
        setShowtimes(result);
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: "smooth" });
        }
      })
      .catch((error) => {
        console.error("XML-haku epäonnistui: ", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [filter, date]);

  const filteredShows = showtimes?.Schedule?.Shows?.Show.filter((show) => {
    return show;
  });

  const locationOptions = [
    <>
      <option value="1012">Espoo</option>
      <option value="1002">Helsinki</option>
      <option value="1015">Jyväskylä</option>
      <option value="1016">Kuopio</option>
      <option value="1017">Lahti</option>
      <option value="1041">Lappeenranta</option>
      <option value="1018">Oulu</option>
      <option value="1019">Pori</option>
      <option value="1021">Tampere</option>
      <option value="1022">Turku</option>
      <option value="1046">Raisio</option>
      <option value="1013">Vantaa</option>
    </>
  ];

  const dateOptions = Array.from({ length: 7 }, (_, i) => (
    <option value={getCurrentDate(i)}>{getCurrentDate(i)}</option>
  ));

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return date.toLocaleString("fi-FI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  function getCurrentDate(days) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    const year = currentDate.getFullYear();
    const month =
      currentDate.getMonth() + 1 < 10
        ? "0" + (currentDate.getMonth() + 1)
        : currentDate.getMonth() + 1;
    const day =
      currentDate.getDate() < 10
        ? "0" + currentDate.getDate()
        : currentDate.getDate();
    return `${day}.${month}.${year}`;
  }


  // ----- Ryhmän sivulle lisääminen -----
  const handleGroupSelect = (index) => (e) => {
    const newSelectedGroups = {...selectedGroup, [index]: e.target.value}
    setSelectedGroup(newSelectedGroups);
    setActiveIndex(index)
  }

  const addShowtime = () => {
    if (activeIndex === null || !filteredShows || !filteredShows[activeIndex]) {
      console.error("Invalid showtime or index");
      return;
    }
    const selectedShow = filteredShows[activeIndex];
    const newShowtimeData = {
      groupname: selectedGroup[activeIndex],
      theatreid: selectedShow.TheatreID?._text,
      showdate: selectedShow.dttmShowStart?._text,
      movieid: selectedShow.EventID?._text,
      movietitle: selectedShow.Title?._text,
      showstarttime: selectedShow.dttmShowStart?._text.substr(11, 19),
      img: selectedShow.Images.EventMediumImagePortrait?._text,
    };

    setShowtimeData(newShowtimeData)

      axios
        .post(`http://localhost:3001/groupST/addshowtime`, newShowtimeData)
        .then((response) => {
          console.log("Server response :", response)
        })
        .catch((error) => {
          console.error("Lisäys epäonnistui: ", error);
        }) 
  };

  
  return (
    <div className="showtimes-container" ref={resultsRef}>
      <div className="filter-container">
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Valitse sijainti</option>
          {locationOptions}
        </select>
        <select
          className="filter-select"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        >
          <option value="">Valitse päivä</option>
          {dateOptions}
        </select>
      </div>
      {!filter || !date ? (
        <p className="please">Ole hyvä ja valitse teatteri ja päivä</p>
      ) : isLoading ? (
        <p className="please">Ladataan...</p>
      ) : filteredShows && filteredShows.length > 0 ? (
        <ul className="st-list">
          {filteredShows.map((show, index) => (
            <li className="st-item" key={index} onClick={() => setActiveIndex(index)}>
              <p className="st-time">{formatDate(show.dttmShowStart?._text)}</p>
              <h1 className="st-title">{show.Title?._text}</h1>
              <p className="st-details">Teatteri: {show.Theatre?._text}</p>
              <img
                className="st-image"
                src={show.Images.EventMediumImagePortrait?._text}
                alt="show"
              />
              {user && (
                <>
                  <p>Lisää ryhmän sivulle</p>
                  <select onChange={handleGroupSelect(index)} value={selectedGroup[index] || ''}>
                    <option value="">Valitse ryhmä</option>
                    {userGroups.map((group, index) => (
                      <option key={index} value={group.name}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  {selectedGroup[index] && (
                    <div className="submit_button">
                      <button type="submit" onClick={addShowtime}>Lisää</button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        filter &&
        date && (
          <p className="please">
            Ei näytöksiä valitulle teatterille ja päivälle
          </p>
        )
      )}
    </div>
  );
}
