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
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

const App = () => {
  let handLandmarker = undefined
  let runningMode = "IMAGE"
  let webcamRunning = false
  
  const [username, setUsername] = useState(null)
  console.log(`Username: ${username}`)

  useEffect(() => {
    const createHandLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      )
      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        },
        numHands: 2
      })
    }
    createHandLandmarker()
  }, [])

  const video = document.getElementById("webcam");

  const canvasElement = document.getElementById("output_canvas")
  const canvasCtx = canvasElement.getContext("2d");

  const enableCam = (event) => {
    if (!handLandmarker) {
      console.log("Wait! objectDetector not loaded yet.");
      return;
    }

    if (webcamRunning === true) {
      webcamRunning = false;
      enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    } else {
      webcamRunning = true;
      enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }

    const constraints = {
      video: true
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      video.srcObject = stream;
      video.addEventListener("loadeddata", predictWebcam);
    });
  }

  const enableWebcamButton = document.getElementById("webcamButton");
  enableWebcamButton.addEventListener("click", enableCam);


  let lastVideoTime = -1;
  let results = undefined;
  console.log(video);

  async function predictWebcam() {
    canvasElement.style.width = video.videoWidth;;
    canvasElement.style.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    


    if (runningMode === "IMAGE") {
		runningMode = "VIDEO";
		await handLandmarker.setOptions({ runningMode: "VIDEO" });
	  }
  
	  let startTimeMs = performance.now();
	  if (lastVideoTime !== video.currentTime) {
		lastVideoTime = video.currentTime;
		results = handLandmarker.detectForVideo(video, startTimeMs);
	  }
  
	  canvasCtx.save();
	  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
	  if (results.landmarks) {
		for (const landmarks of results.landmarks) {
		  console.log(landmarks)
		}
	  }
	  canvasCtx.restore();
  
	  // Call this function again to keep predicting when the browser is ready.
	  if (webcamRunning === true) {
		window.requestAnimationFrame(predictWebcam);
	  }
	}
  
	return (
	<Router>
		<Header/>
		<Routes>
			<Route path = "/" element = {(!username) ? (<Login setUsername={setUsername}/>) : (<Lobby/>)}/>
			<Route path = "/gamepage" element = {<GamePage/>}/>
			<Route path = "/leaderboard" element = {<Leaderboard />}/>
		</Routes>
	</Router>

	)}	
	
export default App
