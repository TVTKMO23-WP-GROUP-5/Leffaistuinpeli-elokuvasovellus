import React, { useState, useEffect } from "react";
import "./ShowTimes.css"
import axios from "axios";
import xml2js from "xml-js";

export default function Showtimes() {
  const [showtimes, setShowtimes] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://www.finnkino.fi/xml/Schedule/",
          {
            responseType: "text",
          }
        );
        const result = xml2js.xml2js(response.data, {
          compact: true,
          spaces: 4,
        });
        setShowtimes(result);
      } catch (error) {
        console.error("Näytösaikojen haku epäonnistui: ", error);
      }
    };

    fetchData();
  }, []);

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    return date.toLocaleString("fi-FI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  const theatreOptions = showtimes
    ? Array.from(
        new Set(showtimes.Schedule.Shows.Show.map((show) => show.Theatre._text))
      )
    : [];

  const filteredShows = showtimes?.Schedule?.Shows?.Show.filter((show) => {
    return filter ? show.Theatre._text === filter : true;
  });

  return (
    <div className="showtimes-container">
      <div className="filter-container">
        <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">Kaikki teatterit</option>
          {theatreOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {filteredShows && filteredShows.length > 0 ? (
        <ul className="st-list">
          {filteredShows.map((show, index) => (
            <li className="st-item" key={index}>
              <div className="st-time">
                <p>{formatDate(show.dttmShowStart?._text)}</p>
              </div>
              <h1 className="st-title">{show.Title?._text}</h1>
              <p className="st-details">Kesto: {show.dttmShowEnd?._text}</p>
              <p className="st-details">Teatteri: {show.Theatre?._text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Ei näytösaikoja saatavilla.</p>
      )}
    </div>
  );
}
