import { useEffect, useState } from "react"
import { UserContext } from "./UserContext"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { jwtToken } from '../components/Auth_signals'

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false);
  const [registerData, setRegisterData] = useState() // Jaakon lisäys 27.3. rekisteröintiä varten
  const [movieData, setMovieData] = useState()
  const [moviePick, setMoviePick] = useState([])
  const [groups, setGroups] = useState([])
  const [userGroups, setUserGroups] = useState([])
  const [isHome, setIsHome] = useState(false)
  const [loading, setLoading] = useState(false)
  const [movies, setMovies] = useState([])
  const [groupMembers, setGroupMembers] = useState({})
  const [ratingsList, setRatingsList] = useState([])
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  const login = async (uname, password) => {
    axios.post('/auth/login',
      { username: uname, password: password })
      .then(resp => {
        setUser(uname) // jaakko muokkas, että tässä setUseriin menee vain uname, aiemmin {username: uname}, mutta se aiheutti ongelmia adminiin. 
        jwtToken.value = resp.data.jwtToken
        sessionStorage.setItem('username', uname)
        // toinen axios-kutsu tarkastaa, että onko käyttäjä myös admin
        axios
          .post("/getmembers/checkowner", { username: uname })
          .then((response) => {
            setIsAdmin(response.data);
            sessionStorage.setItem('admin', response.data)
          })
          .catch((error) => {
            console.error("Fetching failed", error);
          });
        navigate('/')
        alert("Kirjautuminen onnistui!")
      })
      .catch(err => console.log(err.message, alert("Väärä käyttäjätunnus tai salasana!")))
  }

  // Asettaa groupMemberseihin,jos käyttäjä on adminina niin tietoa. 
  useEffect(() => {
    if (user !== null) {
      axios.post('/getmembers', { username: user })
        .then(response => {
          setGroupMembers(response.data)
        })
        .catch(error => {
          console.error("Fetching failed", error)
        })
    }
  }, [user]);

  // Asettaa kaikki arvostelut ratingsListaan
  useEffect(() => {
    axios.get("/rating/getrating")
      .then((response) => {
        setRatingsList(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        console.error("Error adding favorite:", error);
        alert("Virhe arvostelujen lataamisessa.");
      })
  }, [])

  useEffect(() => {
    const storedUser = sessionStorage.getItem("username");
    const storedAdmin = sessionStorage.getItem("admin")
    if (storedUser === "null") {
      setUser(null);
    } else {
      setUser(storedUser)
    }
    if (storedAdmin === "null") {
      setIsAdmin(true);
    } else {
      setIsAdmin(storedAdmin)
    }
  }, [setUser, setIsAdmin]);

  useEffect(() => {
    const storedMoviePick = sessionStorage.getItem("moviePick");
    if (Array.isArray(storedMoviePick)) {
      setMoviePick((storedMoviePick));
    } else {
      setMoviePick([])
    }
  }, [setMoviePick]);


  useEffect(() => {
    if (user) {
      const username = sessionStorage.getItem('username')
      axios
        .get(`/groups/owngroups?username=${username}`)
        .then((response) => {
          setUserGroups(response.data);
        })
        .catch((error) => {
          console.error("Fetching failed", error);
        });
    }
  }, [user]);

  useEffect(() => {
    sessionStorage.removeItem('moviePick')
    sessionStorage.setItem('page', parseInt(1))
  }, []);

  return (
    <UserContext.Provider value={{
      user, setUser, registerData, setRegisterData,
      movieData, setMovieData, moviePick, setMoviePick, isHome, setIsHome,
      loading, setLoading, movies, setMovies, groups, setGroups, userGroups, setUserGroups, login,
      isAdmin, setIsAdmin, groupMembers, setGroupMembers, ratingsList, setRatingsList,
      page, setPage
    }}>
      {children}
    </UserContext.Provider>
  )
}
