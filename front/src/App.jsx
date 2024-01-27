import './index.css'
import { useEffect, useState } from 'react'
import Webcam from 'react-webcam'

const App = () => {
	// Debug message
	console.log('Loaded app')

	// Full circle radians
	const circRad = Math.PI * 2

	// Canvas frame
	const width = 800
	const height = 800

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
			x: 50,
			y: 50,
			vx: 5,
			vy: 2,
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
			shipWidth: 500,
			shipHeight: 50,
			leftBorder: 0,
			rightBorder: 0,
			vx: 5,
			vy: 0,
			color: 'red',
			draw() {
				ctx.beginPath()
				ctx.fillRect(this.x, this.y, this.shipWidth, this.shipHeight)
			}
		}

		// Set new borders of specified object
		const set_border = (obj) => {
			obj.leftBorder = obj.x
			
		}

		// Draw a single frame.
		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// ### Ball ###
			ball.draw()

			// Boundary detection in x
			if (ball.x + ball.vx > width || ball.x + ball.vx < 0) {
				ball.vx = -ball.vx // Invert ball velocity
			}

			// Boundary detection in y
			if (ball.y + ball.vy > height || ball.y + ball.vy < 0) {
				ball.vy = -ball.vy // Invert ball velocity
			}

			ball.x += ball.vx;
			ball.y += ball.vy;

			// ### Ship ###
			ship.rightBorder = ship.x
			ship.draw()

			if (ship.x + ship.vx > width || ship.x + ship.vx < 0) {
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

	return (
		<div>
			{/* <div id='webcam-container'>
				<Webcam mirrored={true} imageSmoothing={true} audio={false} videoConstraints={videoConstraints}/>	
			</div> */}
			{/* Canvas */}
			<div> 
				<canvas id="canvas" width={width} height={height}>
					use a different browser
				</canvas>
			</div>
		</div>
	)
}

export default App
