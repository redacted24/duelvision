<<<<<<< HEAD
import { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import './styles/index.css'
import Camera from './components/Camera'
import Login from './components/Login'



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
	
	// Debug message
	console.log('Loaded app')

	// Full circle radians
	const circRad = Math.PI * 2

	// Canvas frame
	const canvas_width = 800
	const canvas_height = 800

	// Some Rules for the Webcam. Entire object is passed as a prop in the Webcam component
	const videoConstraints = {
		width: { min: 1080},
		height: { min: 720},
		aspectRatio: 0.666666666666666667
	}

	// Canvas loading
	useEffect(() => {
		const canvas = document.getElementById('canvas')
		const ctx = canvas.getContext('2d')
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

			// ### Ball ###
			ball.draw()

			// Boundary detection
			if (ball.x + ball.vx > canvas_width || ball.x + ball.vx < 0) {
				ball.vx = -ball.vx // Invert ball velocity
			}
			if (ball.y + ball.vy > canvas_height || ball.y + ball.vy < 0) {
				ball.vy = -ball.vy // Invert ball velocity
			}
			if (ball.y + ball.vy < ship.y + ship.height && (ship.x <= ball.x && ball.x <= ship.x + ship.width)) {
				console.log('Ball and Ship collision detected')
				ball.vy = -ball.vy
			}
			ball.x += ball.vx;
			ball.y += ball.vy;

			// ### Ship ###
			ship.draw()

			if (ship.x + ship.vx < 0 || ship.x + ship.width + ship.vx > canvas_width) {
				console.log('Border collision detected')
				ship.vx = -ship.vx
			}
			ship.x += ship.vx

			// Request next frame
			raf = window.requestAnimationFrame(draw);
		}
		
		// Activate drawing
		canvas.addEventListener("mouseover", (e) => {
			raf = window.requestAnimationFrame(draw);
		  });

		canvas.addEventListener("mouseout", (e) => {
			window.cancelAnimationFrame(raf);
		});
	},[])

	// Draw function
		// Drawing shapes
			// ctx.beginPath() Path drawing
			// fillRect(x, y, width, height) FULL RECTANGLE
			// strokeRect(x, y, width, height) OUTLINE RECTANGLE (path drawn)
			// clearRect(x, y, width, height) CLEARS RECTANGLE (transparent, or erase)
			// fillStyle = "rgb(r g b alpha)"
			// ctx.stroke() Outline drawing. Must close path beforehand
			// ctx.closePath()
			// arc(x, y, radius, startAngle, endAngle, counterclockwise)
			// arcTo(x1, y1, x2, y2, radius)
			// ctx.fillStyle()
			// ctx.strokeStyle()
	
	// const init = () => {
	// 	window.requestAnimationFrame(draw)
	// }

	// const draw = () => {
	// 	console.log('Drawing...')
	// 	const ctx = document.getElementById('canvas').getContext('2d')
	// 	// ctx.globalCompositeOperation = 'destination-over'

	// 	// Clear
	// 	ctx.clearRect(0,0, height, width)

	// 	// Save
	// 	ctx.fillStyle = "#000000"
	// 	ctx.save()

	// 	// Movement
	// 	ctx.translate(1, 1)
	// 	ctx.save()
	
	// 	// New frame content
	// 	ctx.fillRect(0,0,10,10)
	// 	ctx.restore()

	// 	// window.requestAnimationFrame(draw)
	// }

	// init()
	if (!username) {
		return <Login setUsername={setUsername} />
	} else {
		return (
			<div>
				{/* <div id='webcam-container'>
					<Webcam mirrored={true} imageSmoothing={true} audio={false} videoConstraints={videoConstraints}/>	
				</div> */}
				{/* Canvas */}
				<div>
					<div>
						<Camera ready={socket.readyState} sendMessage={sendMessage}/>
					</div>
					<canvas id="canvas" width={canvas_width} height={canvas_height}>
						use a different browser
					</canvas>
				</div>
			</div>
		)}
	}	
	
export default App
