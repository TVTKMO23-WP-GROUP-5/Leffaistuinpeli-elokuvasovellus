import "./Register.css"
import React, { useState } from 'react'
import { useUser } from '../context/UseUser'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register() {

  // contextin useUserista haetaan registerData ja asetetaan tiedot aluksi tyhjäksi
  const {registerData, setRegisterData} = useUser({
    fname: '',
    lname: '',
    email: '',
    username: '',
    password: ''
})
const [passwordLength, setPasswordLength] = useState(0)

// samalla kun kirjoitetaan kenttiin, data päivittyy
const handleChange = (e) => {
    setRegisterData(prevRegisterData => ({
        ...prevRegisterData,
        [e.target.name]: e.target.value
    }))
    if (e.target.name === "first_password"){
        setPasswordLength(e.target.value.length)
    }
    console.log(passwordLength)
}

// luo navigointimahdollisuuden 
const navigate =  useNavigate()

// funktio, joka tapahtuu, kun painetaan tunnuksen luomista
const handleSubmit = (event) => {
    event.preventDefault()

    // Tarkastetaan, onko salasanat samat
    if (registerData.first_password !== registerData.password) {
      alert("Salasanat eivät täsmää")
      return;
    }

    console.log(registerData)

    axios.post('/auth/register', registerData)
        .then(response => {
            if (response.data.message === "success"){
                console.log('User registered successfully:', response.data);
                alert("Käyttäjätunnuksen luominen onnistui")
                navigate('/login')
            } else {
                console.log('Something went wrong:', response.data);
                alert("Tunnuksen luominen epäonnistui...")
            }


        })
        .catch(error => {
            console.error('Error registering user:', error.response.data);
            alert("Virhe käyttäjätunnuksen luomisessa...")
        })  


};

return (
    <div className='main'>
        <div className='rekisteröidy'>
            <form onSubmit = {handleSubmit}>
                <h2>Luo tunnus</h2>
                <input type="text" className="registerInput" name="fname" placeholder='Etunimi' onChange={handleChange} />
                <input type="text" className="registerInput" name="lname" placeholder='Sukunimi' onChange={handleChange} />
                <input type="email" className="registerInput" name="email" placeholder='Sähköposti' onChange={handleChange} />
                <input type="text" className="registerInput" name="username" placeholder='Käyttäjätunnus' onChange={handleChange} />
                <input type="password" className="registerInput" name="first_password" placeholder='Salasana' onChange={handleChange} />
                    <p style={{ color: passwordLength < 8 ? 'red' : 'black' }}>
                    {passwordLength < 8 
                            ? (
                                <>
                                    Vähintään 8 merkkiä. Pituus: {passwordLength}
                                </>
                            ) 
                            : (
                                <>
                                    Salasana ok. Pituus: {passwordLength}
                                </>
                            )}
                    </p>
                <input type="password" className="registerInput" name="password" placeholder='Salasana uudestaan' onChange={handleChange} />
                <button type="submit" className="continue">Jatka</button>
            </form>
        </div>
    </div>
)
}
