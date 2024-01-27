import './styles/index.css'
import Camera from './components/Camera'
import Login from './components/Login'

import { useState } from 'react'

const App = () => {
  let url = 'ws://192.168.173.38:8001'
  let socket = new WebSocket(url);

  const sendMessage = (message) => {
    if (socket.readyState) socket.send(message)
  };

  socket.onmessage = async (event) => {
    let incomingMessage = event.data;
    console.log(incomingMessage)
  };

  socket.onclose = event => console.log(`Closed ${event.code}`)

  const [username, setUsername] = useState(null)

  if (!username) return <Login setUsername={setUsername} />

	return (
		<div>
      <Camera ready={socket.readyState} sendMessage={sendMessage} />
		</div>
	)
}

export default App
