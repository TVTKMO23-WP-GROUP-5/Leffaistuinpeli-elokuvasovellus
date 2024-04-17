import { useEffect, useState } from "react"
import { UserContext } from "./UserContext"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { jwtToken } from '../components/Auth_signals'

export default function UserProvider({children}) {
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
    const navigate = useNavigate()

    const login = async(uname,password) => {
        axios.post('http://localhost:3001/auth/login',
            {username: uname, password: password})
            .then(resp => {
                setUser(uname) // jaakko muokkas, että tässä setUseriin menee vain uname, aiemmin {username: uname}, mutta se aiheutti ongelmia adminiin. 
                jwtToken.value = resp.data.jwtToken
                sessionStorage.setItem('username', uname) 
                navigate('/userpage')
                alert("Kirjautuminen onnistui!")
            })
            .catch(err => console.log(err.message))
    }

    // Asettaa groupMemberseihin,jos käyttäjä on adminina niin tietoa. 
    useEffect(() => {
      if (user !== null) {
          axios.post('http://localhost:3001/getmembers', {username: user})
              .then(response => {
                  setGroupMembers(response.data)
                  console.log(response.data.application)
              })
              .catch(error => {
                  console.error("Fetching failed", error)
              })
      }
    }, [user]);

    useEffect(() => {
        const storedUser = sessionStorage.getItem("username");
        if (storedUser === "null") {
          setUser(null);
        } else {
          setUser(storedUser)
        }
      }, [setUser]);
    
    useEffect(() => {
        const storedMoviePick = sessionStorage.getItem("moviePick");
        if (Array.isArray(storedMoviePick)) {
          setMoviePick((storedMoviePick));
        } else {
            setMoviePick([])
        }
      }, [setMoviePick]);

    useEffect(() => {
        axios
          .post("http://localhost:3001/getmembers/checkowner", { username: user })
          .then((response) => {
            setIsAdmin(response.data);
          })
          .catch((error) => {
            console.error("Fetching failed", error);
          });
      }, [user]);

    useEffect(() => {
      if (user) {
        const username = sessionStorage.getItem('username')
        axios
          .get(`http://localhost:3001/groups/owngroups?username=${username}`)
          .then((response) => {
            setUserGroups(response.data);
            console.log(userGroups)
          })
          .catch((error) => {
            console.error("Fetching failed", error);
          });
        }
      }, [user]);


    return (
        <UserContext.Provider value={{user,setUser,registerData,setRegisterData,
          movieData,setMovieData,moviePick,setMoviePick, isHome, setIsHome,
          loading,setLoading,movies,setMovies,groups,setGroups,userGroups,setUserGroups,login,
          isAdmin, setIsAdmin, groupMembers, setGroupMembers}}>
            { children }
        </UserContext.Provider>
    )
}
