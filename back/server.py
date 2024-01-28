#! /bin/python
import asyncio
import websockets
from vision import image
import json
import time

async def handler(websocket):
    count = 0
    while True:
        message = await websocket.recv()
        try:
            b64_img = message.split(',')[1]
            #print(message)
            #print("\n----\n")
            coord_ls = image(b64_img)
            #a = time.time()
            await websocket.send(json.dumps({ 'coordinates': coord_ls }))
            #b = time.time()
            #print(1/(b - a))
            #print(image(b64_img))
        except:
            print("error")



async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())

