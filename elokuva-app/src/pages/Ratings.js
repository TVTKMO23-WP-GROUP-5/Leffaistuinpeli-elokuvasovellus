import React, { useEffect, useState } from 'react'
import './Ratings.css'
import axios from 'axios'
import { useUser } from '../context/UseUser'
import { useTheme } from '../context/ThemeContext';

export default function Ratings() {
    const { theme } = useTheme();
    const { ratingsList, setRatingsList, user } = useUser()
    const [showRatings, setShowRatings] = useState([])
    const [sort, setSort] = useState([])
    const [sortType, setSortType] = useState("name")
    const [isChecked, setIsChecked] = useState(false)
    const [filter, setFilter] = useState("")
    const [page, setPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [isButton, setIsButton] = useState(true)

    useEffect(() => {
        axios.post("/rating/ratedmoviedata", { data: ratingsList })
            .then((response) => {
                setShowRatings(response.data)
                setSort(response.data)
            })
            .catch((error) => {
                console.error("Error adding favorite:", error.response.data);
                alert("Virhe arvostelujen lataamisessa.");
            })
    }, [ratingsList])

    const sortMovies = (sorting, check) => {
        setFilter("")
        console.log(sorting, check)
        if (sorting === "name") {
            const sortedRatings = [...showRatings].sort((a, b) => {
                const titleA = a.title ? a.title.toLowerCase() : a.name.toLowerCase();
                const titleB = b.title ? b.title.toLowerCase() : b.name.toLowerCase();
                if (check) {
                    return titleB.localeCompare(titleA);
                } else if (!check) {
                    return titleA.localeCompare(titleB);
                }

            })
            setSort(sortedRatings)
        } else if (sorting === "stars") {
            const sortedRatings = [...showRatings].sort((a, b) => {
                const starA = parseInt(a.stars);
                const starB = parseInt(b.stars);
                if (check) {
                    return starB - starA
                } else if (!check) {
                    return starA - starB
                }

            })
            setSort(sortedRatings)
        } else if (sorting === "user") {
            const sortedRatings = [...showRatings].sort((a, b) => {
                const userA = a.rater.toLowerCase()
                const userB = b.rater.toLowerCase()
                if (check) {
                    return userB.localeCompare(userA)
                } else if (!check) {
                    return userA.localeCompare(userB)
                }
            })
            setSort(sortedRatings)
        } else if (sorting === "average") {
            const sortedRatings = [...showRatings].sort((a, b) => {
                const averageA = parseFloat(averages[a.title ? a.title : a.name]);
                const averageB = parseFloat(averages[b.title ? b.title : b.name]);
                return check ? averageB - averageA : averageA - averageB;
            });
            setSort(sortedRatings);
        }
    }

    const clickPick = (name) => {
        setFilter(name)
        setPage(1)
        setIsButton(false)
        setItemsPerPage(1000)
    }

    const handleClickNext = () => {
        setPage(prevPage => prevPage + 1)
        console.log("höÖ", endIndex, sort.length)
    };

    const startIndex = (page - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage

    const handleClickPrevious = () => {
        setPage(prevPage => Math.max(prevPage - 1, 1))
        console.log("höÖ", endIndex, sort.length)
    };

    const topFiveList = () => {
        const voteAverage = {}
        sort.forEach((movie, index) => {
            if (voteAverage[movie.title ? movie.title : movie.name]) {
                voteAverage[movie.title ? movie.title : movie.name].push(movie.stars);
            } else {
                voteAverage[movie.title ? movie.title : movie.name] = [movie.stars];
            }
        })
        const averages = {}
        Object.keys(voteAverage).forEach(movieName => {
            const starsArray = voteAverage[movieName]
            const sum = starsArray.reduce((acc, star) => acc + star, 0)
            const average = sum / starsArray.length
            averages[movieName] = average.toFixed(2)
        })

        const averagesArray = Object.entries(averages);

        averagesArray.sort((a, b) => b[1] - a[1]);

        const sortedAverages = Object.fromEntries(averagesArray);

        return sortedAverages;
    }
    const averages = topFiveList()
    return (
        <div className="marginiaYlos">
        <div className={theme === 'dark' ? 'dark-theme' : ''}>
            <div className="choises">
                <div>
                <select name="sort" onChange={(e) => {
                    setSortType(e.target.value)
                    sortMovies(e.target.value, isChecked)
                    setIsButton(true)
                    setItemsPerPage(10)
                }}>
                    <option disabled selected>Järjestä</option>
                    <option value="name">Elokuvan nimi</option>
                    <option value="stars">Tähdet</option>
                    <option value="average">Tähdet (keskiarvo)</option>
                    <option value="user">Arvostelija</option>

                </select>
                </div>
                <label className="toggle-switch">
                    <input type="checkbox" checked={isChecked} onChange={(e) => {
                        setIsChecked(e.target.checked)
                        sortMovies(sortType, e.target.checked)
                        setIsButton(true)
                        setItemsPerPage(10)
                    }} />
                    <span className="slider">
                        <span className="arrow-up">&#9650;</span>
                        <span className="arrow-down">&#9660;</span>
                    </span>
                </label>
                <div>
                    <input type="text" placeholder="Hakusana" onChange={(e) => {
                        setFilter(e.target.value)
                        setIsButton(false)
                        setItemsPerPage(1000)
                        setPage(1)
                    }} />
                </div>
            </div>
            <div className="changePage">
                {isButton && page > 1 && 
                <div className='ratingsPrevious'>    
                    <button onClick={handleClickPrevious} disabled={page === 1}>Edellinen</button>
                </div>
                }
                <div className="page-number">sivu {page}</div>
                {isButton && endIndex < sort.length && 
                <div className='ratingsNext'>  
                    <button onClick={handleClickNext}>Seuraava</button>
                </div>      
                }
            </div>
            <div className="ratingslist">
                {sort &&
                    sort
                        .filter(movie =>
                            filter === "" ||
                            movie.title === filter ||
                            movie.name === filter ||
                            movie.rater === filter ||
                            (movie.title ? movie.title.toLowerCase().includes(filter.toLowerCase()) : false) ||
                            (movie.name ? movie.name.toLowerCase().includes(filter.toLowerCase()) : false)
                        )
                        .slice(startIndex, endIndex)
                        .map((movie, index) => (
                            <div className="movieRatings" key={index}>
                                <img
                                    src={"https://image.tmdb.org/t/p/w342/" + movie.poster_path}
                                    alt="Movie poster"
                                    onClick={() => clickPick(movie.title ? movie.title : movie.name)}
                                />
                                <div className="movieDetails">
                                    <p><strong>{movie.title ? movie.title : movie.name}</strong> {movie.media_type === "movie" ? (<span>(elokuva)</span>) : movie.media_type === "tv" && (<span>(tv-sarja)</span>)}</p>
                                    <p>
                                        {Array.from({ length: movie.stars }, (_, index) => (
                                            <span key={index} className="ratingstars">&#9733;</span>
                                        ))}
                                        <span className="average">(keskiarvo: {averages[movie.title ? movie.title : movie.name]})</span>
                                    </p>
                                    <p>Käyttäjä <span className="raterName" onClick={() => clickPick(movie.rater)}><strong>{movie.rater}:</strong></span></p>
                                    <p>{movie.description}</p>
                                </div>
                            </div>
                        ))}

            </div>
            <div className="changePage">
                {isButton && page > 1 && 
                <div className='ratingsPrevious'>    
                    <button onClick={handleClickPrevious} disabled={page === 1}>Edellinen</button>
                </div>
                }
                <div className="page-number">sivu {page}</div>
                {isButton && endIndex < sort.length && 
                <div className='ratingsNext'>  
                    <button onClick={handleClickNext}>Seuraava</button>
                </div>      
                }
            </div>
        </div>
        </div>
    ) 
}
