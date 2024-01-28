import React from 'react'
import Webcam from 'react-webcam'
import { useEffect } from 'react'
import '../styles/camera.css'
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'user'
  };
  
const Camera = ({ sendMessage }) => {

    const webcamRef = React.useRef(null)
    let handLandmarker = undefined
    let runningMode = "IMAGE"
    let webcamRunning = false
  
    const video = document.getElementById("webcam");
    const canvasElement = document.getElementById("output_canvas")
  
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
  
    useEffect(() => {
      const canvasCtx = canvasElement.getContext("2d");
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
          const enableWebcamButton = document.getElementById("webcamButton");
          enableWebcamButton.addEventListener("click", enableCam);
    }, [])

    const capture = React.useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot()
            sendMessage(imageSrc)
        },
        [webcamRef]
    )

    useEffect(() => {
        const interval = setInterval(() => capture(), 1000 / 30);

        return () => clearInterval(interval)
    }, [])


    return (
        <div id='camera-container'>
            {/* <Webcam
                audio={false}
                height={720}
                ref={webcamRef}
                screenshotFormat='image/jpeg'
                width={1280}
                videoConstraints={videoConstraints}
            /> */}
            <div id="liveView" className="videoView">
            <button id="webcamButton" className="mdc-button mdc-button--raised">
                <span className="mdc-button__ripple"></span>
                <span className="mdc-button__label">ENABLE WEBCAM</span>
            </button>
            <div id="webcam-container">
                <video id="webcam" autoPlay playsInline></video>
                <canvas className="output_canvas" id="output_canvas"></canvas>
            </div>
            </div>
        </div>
    )
}

export default Camera
