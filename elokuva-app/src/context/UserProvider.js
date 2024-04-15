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
    const [isHome, setIsHome] = useState(false)
    const [loading, setLoading] = useState(false)
    const [movies, setMovies] = useState([])
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


    return (
        <UserContext.Provider value={{user,setUser,registerData,setRegisterData,
          movieData,setMovieData,moviePick,setMoviePick, isHome, setIsHome,
          loading,setLoading,movies,setMovies,groups,setGroups,login,
          isAdmin, setIsAdmin}}>
            { children }
        </UserContext.Provider>
    )
}
