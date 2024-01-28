import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Header from './components/Header'
import './styles/index.css'
import Camera from './components/Camera'
import Login from './components/Login'
import Canvas from './components/Canvas'
import Leaderboard from './components/Leaderboard'
import GamePage from './components/GamePage'
import Lobby from './components/Lobby'

const App = () => {
	let url = 'ws://192.168.173.38:8001'
	let socket = new WebSocket(url);

	const sendMessage = (message) => {
		if (socket.readyState) socket.send(message)
	};
	
	socket.onmessage = (event) => {
		let incomingMessage = event.data;
    
		console.log(incomingMessage)
	};
	
	
	socket.onclose = event => console.log(`Closed ${event.code}`)

	const [username, setUsername] = useState(null)
	console.log(`Username: ${username}`)

	return (
	<Router>
		<Header/>
		<Routes>
			<Route path = "/" element = {(!username) ? (<Login setUsername={setUsername}/>) : (<Lobby/>)}/>
			<Route path = "/gamepage" element = {<GamePage/>}/>
			<Route path = "/leaderboard" element = {<Leaderboard />}/>
		</Routes>
	</Router>

	)
	}	
	
export default App
