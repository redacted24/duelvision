import { useEffect } from 'react'

const Canvas = () => {
    const circRad = Math.PI * 2
	const canvas_width = 800
	const canvas_height = 800

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
		canvas.addEventListener('mouseover', (e) => {
			raf = window.requestAnimationFrame(draw);
		  });

		canvas.addEventListener('mouseout', (e) => {
			window.cancelAnimationFrame(raf);
		});
	},[])

    return (
        <canvas id='canvas' width={canvas_width} height={canvas_height}>
            use a different browser
        </canvas>
    )
}

export default Canvas