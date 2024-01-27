import './index.css'
import Webcam from 'react-webcam'

const App = () => {

  let url = 'ws://192.168.173.38:8001'

  let socket = new WebSocket(url);
  
  const clicky = () => {
    const obj = { hello: "world" };
    socket.send(new Blob([JSON.stringify(obj, null, 2)], {
      type: "application/json",
    }));
    return false;
  };
  
  socket.onmessage = async (event) => {
    let incomingMessage = event.data;
    console.log(incomingMessage)
  };
  
  socket.onclose = event => console.log(`Closed ${event.code}`)
  
  function showMessage(message) {
    let messageElem = document.createElement('div');
    messageElem.textContent = message;
    document.getElementById('messages').prepend(messageElem);
  }


	// Some Rules for the Webcam. Entire object is passed as a prop in the Webcam component
	const videoConstraints = {
		width: { min: 1080},
		height: { min: 720},
		aspectRatio: 0.666666666666666667
	}
	return (
		<div>
			<div id='webcam-container'>
				<Webcam mirrored={true} imageSmoothing={true} audio={false} videoConstraints={videoConstraints}/>	
			</div>
      <button onClick={clicky}>click</button>
		</div>
	)
}

export default App
