import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import { useEffect } from 'react'

import '../styles/canvasNew.css'

const Canvas = () => {
    let handLandmarker = undefined
    let runningMode = null
    let webcamRunning = false
    let [ship_x, ship_y] = [null, null]

    useEffect(() => {
        const createHandLandmarker = async () => {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
            )
            handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                },
            numHands: 1
          })
        }
        createHandLandmarker()
    }, [])
    
    const video = document.getElementById("webcam");
    
    const canvasElement = document.getElementById("output_canvas")
    
    const enableCam = (event) => {
        if (!handLandmarker) {
            console.log("Wait! objectDetector not loaded yet.")
            return
        }
        
        if (webcamRunning === true) {
            webcamRunning = false;
            enableWebcamButton.innerText = "ENABLE PREDICTIONS"
        } else {
            webcamRunning = true;
            enableWebcamButton.innerText = "DISABLE PREDICTIONS"
        }
    
        const constraints = {
            video: true
        }
    
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
            video.srcObject = stream;
            video.addEventListener("loadeddata", predictWebcam);
        })
    }
    
    const enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
    
    
    let lastVideoTime = -1;
    let results = undefined;
    console.log(video);
    async function predictWebcam() {
        canvasElement.style.width = video.videoWidth
        canvasElement.style.height = video.videoHeight
        canvasElement.width = video.videoWidth
        canvasElement.height = video.videoHeight

        if (runningMode === null) {
            runningMode = "VIDEO";
            await handLandmarker.setOptions({ runningMode: "VIDEO" });
        }

        let startTimeMs = performance.now();
        if (lastVideoTime !== video.currentTime) {
            lastVideoTime = video.currentTime;
            results = handLandmarker.detectForVideo(video, startTimeMs);
        }

        if (results.landmarks) {
            for (const landmarks of results.landmarks) {
                let [sum_x, sum_y] = [0, 0]
                landmarks.forEach((landmark) => {
                    const x = landmark.x
                    const y = landmark.y
                    sum_x += x
                    sum_y += y
                })

                ship_x = sum_x / landmarks.length
                ship_y = sum_y / landmarks.length
            }
        } else {
            [ship_x, ship_y] = [null, null]
        }
    
        if (webcamRunning === true) {
            window.requestAnimationFrame(predictWebcam);
        }
    }

    const circRad = Math.PI * 2

	useEffect(() => {
        const canvas = document.getElementById("output_canvas")
        const ctx = canvas.getContext("2d");
		let raf

		// Ball object
		const ball = {
			x: 400,
			y: 400,
			vx: 0,
			vy: 10,
			radius: 25,
			color: 'blue',
			draw() {
				ctx.beginPath()
				ctx.arc(this.x, this.y, this.radius, 0, circRad, true) // Draws circle
				ctx.closePath()
				ctx.fillStyle = this.color
				ctx.fill()
			}
		}

		// Spaceship object
		const ship = {
			x: 100,
			y: 20,
			width: 150,
			height: 50,
			leftBorder: 0,
			rightBorder: 0,
			vx: 5,
			vy: 0,
			color: 'red',
			draw() {
				ctx.beginPath()
				ctx.fillRect(this.x, this.y, this.width, this.height)
			}
		}

		// Draw a single frame.
		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (ship.x) ship.draw()

			ship.x = ship_x * canvas.width - 80
            ship.y = ship_y * canvas.height

			// Request next frame
			raf = window.requestAnimationFrame(draw);
		}
		
		// Activate drawing
		canvas.addEventListener('mouseover', (e) => {
			raf = window.requestAnimationFrame(draw);
		  });

		canvas.addEventListener('mouseout', (e) => {
			window.cancelAnimationFrame(raf);
		});
	},[])

    return (
        <>
            <button onClick={() => {video = null}}>hi</button>
        </>
    )
}

export default Canvas