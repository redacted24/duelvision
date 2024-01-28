import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './styles/index.css'
import Camera from './components/Camera'
import Login from './components/Login'
import Canvas from './components/Canvas'

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

	if (!username) {
		return <Login setUsername={setUsername} />
	} else {
		return (
      	<Router>
        	<div>
				<Header></Header>
          		<Camera sendMessage={sendMessage}/>
          		<Canvas />
        	</div>
		</Router>

		)}
	}	
	
export default App
