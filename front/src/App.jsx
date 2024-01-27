import './index.css'
import Camera from './Camera'

const App = () => {
  let url = 'ws://192.168.173.38:8001'
  let socket = new WebSocket(url);

  const sendMessage = (message) => {
    socket.send(message);
    return false;
  };

  socket.onmessage = async (event) => {
    let incomingMessage = event.data;
    console.log(incomingMessage)
  };

  socket.onclose = event => console.log(`Closed ${event.code}`)

	return (
		<div>
			<div>
        <Camera sendMessage={sendMessage} />
			</div>
		</div>
	)
}

export default App
