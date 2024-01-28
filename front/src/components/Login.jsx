import { useState } from 'react'
import '../styles/login.css'
import Header from './Header'

const Login = ({ setUsername }) => {
    const [tempUser, setTempUser] = useState('')

    const handleChange = (e) => {
        setTempUser(e.target.value)
    }

    const login = (e) => {
        console.log('Logged in')
        e.preventDefault()
        setUsername(tempUser && `Anonymous ${Math.floor(Math.random * 100000)}`)
        console.log('UserSet')
        setTempUser('')
    }

    return (
        <div>
            <Header/>
            <div id="login-container">
                <h2>
                    Welcome to Star War
                </h2>
                <p id='par-1'className='normal-font login-text'>Play a familiar game in a completely different way! Use your hands to control your spaceship and face off against your opponents! </p>
                <h3>
                    Please enter a username for your journey:
                </h3>
                <form id='form' onSubmit={login}>
                    <input placeholder='USERNAME' id='input' type='text' value={tempUser} onChange={handleChange}></input>
                    <div id='submit-container'>
                        <button id='submit' type='submit'>Join!</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login