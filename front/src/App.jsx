import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Header from './components/Header'
import './styles/index.css'
import Login from './components/Login'
import Leaderboard from './components/Leaderboard'
import GamePage from './components/GamePage'
import Lobby from './components/Lobby'
import Statistics from './components/Statistics'

const App = () => {
    const [username, setUsername] = useState(null)
	const [win, setWin] = useState(0)
	const [loss, setLoss] = useState(0)
	const [lossRatio, setLossRatio] = useState(0)

	return (
        <Router>
            <Header username = {username}/>
            <Routes>
                <Route path = "/" element = {(!username) ? (<Login setUsername={setUsername}/>) : (<Lobby/>)}/>
                <Route path = "/gamepage" element = {<GamePage/>}/>
                <Route path = "/leaderboard" element = {<Leaderboard win = {win} loss = {loss} lossRatio = {lossRatio} username = {username}/>}/>
                <Route path = "/statistics" element = {<Statistics win = {win} loss = {loss} lossRatio = {lossRatio} username = {username}/>}/>
            </Routes>
        </Router>
)}	

export default App
