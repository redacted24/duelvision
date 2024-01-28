#! /bin/python
import asyncio
import websockets
import json
import time

"""
INITIATION
client connect
recv: json
{
player color
bullet color
}
send echo hello
respond with hello
success

ESTABLISHED
if 2nd player not connected send wait signal
when second player connected (if the list is 1 before appending, send signal to waiting one that it is ready to play)

GAME START
when hit the edge, send data json
{
x: coord
y: coord
}

check the socket
send it to the opposing one

when receiving opposing
do the same
game loop

Todo
handle connections drops
if kill is sent from client or pinging client periodically does not work, then pause game and await 

"""

status_wait = { "x": 0, "status_wait": True }
status_ready = { "x": 0, "status_wait": False }


clients = []

async def initiate(websocket):
    global clients
    if len(clients) <= 2 and websocket not in clients:
        # server hello
        await websocket.send("hello")

        response = await websocket.recv()

        if response == "hello":
            clients.append(websocket)

            if len(clients) == 2:
                await clients[0].send(json.dumps(status_ready))
                await clients[1].send(json.dumps(status_ready))

            else:
                await websocket.send(json.dumps(status_wait))

async def handler(websocket):
    global clients

    if len(clients) >= 2:
        return 0

    # initiation
    if websocket not in clients:
        await initiate(websocket)


    #client_id = clients.index(websocket)
    while True:
        try:
            msg = await websocket.recv()

            client_idx = clients.index(websocket)
            
            await clients[client_idx - 1].send(msg)




            #print(dir(websocket))
            #await websocket.send(f"[{time.time()}] ID: {client_id} You said: {msg}")

        except websockets.exceptions.ConnectionClosed as e:
            print(e)
            client_idx = clients.index(websocket)
            await clients[client_idx - 1].send(json.dumps(status_wait))
            clients.remove(websocket)
            break

        #except Exception as e:
        #    print("WEBSOCKET ERROR:", e)


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())

