import './index.css'
import Camera from './components/Camera'
import Login from './components/Login';

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

	return (
		<div>
      <Login />
      <Camera ready={socket.readyState} sendMessage={sendMessage} />
		</div>
	)
}

export default App
