import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Header from './components/Header'
import './styles/index.css'
import Login from './components/Login'
import Leaderboard from './components/Leaderboard'
import GamePage from './components/GamePage'
import Lobby from './components/Lobby'
import Canvas from './components/Canvas'

const App = () => {
    const [username, setUsername] = useState(null)
    console.log(`Username: ${username}`)

    
  
	return (
	<Router>
        <Canvas />
		{/* <Header/>
		<Routes>
			<Route path = "/" element = {(!username) ? (<Login setUsername={setUsername}/>) : (<Lobby/>)}/>
			<Route path = "/gamepage" element = {<GamePage/>}/>
			<Route path = "/leaderboard" element = {<Leaderboard />}/>
		</Routes> */}
	</Router>

	)}	
	
export default App
