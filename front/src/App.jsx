import './index.css'
import Webcam from 'react-webcam'

let url = 'ws://192.168.173.38:7890'

let socket = new WebSocket(url)

socket.send('hi')

socket.onmessage = async (event) => {
  console.log(event)
}

const App = () => {

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
		</div>
	)
}

export default App
