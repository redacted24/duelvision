#! /bin/python
import websockets
import asyncio
 
# Creating WebSocket server
async def ws_server(websocket):
    print("WebSocket: Server Started.")
 
    try:
        while True:
            # Receiving values from client
            name = await websocket.recv()
 
            # Prompt message when any of the field is missing
            if name == "":
                print("Error Receiving Value from Client.")
                break
            print(name)

    except websockets.ConnectionClosedError:
        print("Internal Server Error.")
 
 
async def main():
    async with websockets.serve(ws_server, "localhost", 7890):
        await asyncio.Future()  # run forever
 
if __name__ == "__main__":
    asyncio.run(main())
