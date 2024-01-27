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
            age = await websocket.recv()
 
            # Prompt message when any of the field is missing
            if name == "" or age == "":
                print("Error Receiving Value from Client.")
                break
 
            # Printing details received by client
            print("Details Received from Client:")
            print(f"Name: {name}")
            print(f"Age: {age}")
 
            # Sending a response back to the client
            if int(age) < 18:
                await websocket.send(f"Sorry! {name}, You can't join the club.")
            else:
                await websocket.send(f"Welcome aboard, {name}.")
 
    except websockets.ConnectionClosedError:
        print("Internal Server Error.")
 
 
async def main():
    async with websockets.serve(ws_server, "localhost", 7890):
        await asyncio.Future()  # run forever
 
if __name__ == "__main__":
    asyncio.run(main())
