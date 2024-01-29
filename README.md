# DuelVision
mchacks2024 project made by: redacted24, sivabalansm, Crazydodo123, CyFung721

## Inspiration
We were extremely inspired by all the computer vision projects circulating around, and decided to use it to make a very fun duelling 1v1 game.

## What it does
Inspired from the spaceship game, each player will have to try shooting down the other's spaceship while controlling their own with their hand. You can move your arm around to dodge incoming bullets and shoot your own bullets at the opponent with different hand movements! The game can be played online, from anywhere if both have Internet access.

## How we built it
We used MediaPipe to recognise the different hand positions, which the sprite will follow. Also, depending on different hand gestures, recognised by the computer vision AI, the sprite will be able to shoot projectiles, from a certain position. This will be sent to a server via WebSocket, in order to send the information to the other player. The rest of the frontend is built with React, and the spaceship and bullet are rendered using the canvas HTML element.

## Challenges we ran into
We ran into some problems when communicating between frontend and backend with the Python implementation of MediaPipe, as the connection was too slow. To fix this issue, we reimplemented all of the computer vision with MediaPipe back in JavaScript. We also had some issues with React rendering and the canvas rendering, but that was fixed by reorganizing when and where are components are being loaded.

## Accomplishments that we're proud of
Using computer vision through MediaPipe to track hand movements and taking these coordinates to make the player move. Also implementing it in multiplayer, and making an interactive game otu of it.

## What we learned
We learned how to implement MediaPipe in both Python and JavaScript. We also learned how to use WebSocket to send information of the bullet to a server, and then to another player.

# Dependencies & Libraries
- React Webcam
- React Router Dom
- Mediapipe

```
npm i
npm i react-webcam
npm i react-router-dom
```

# Run

```
npm run dev
```

### Lobby page inspired by tetr.io
