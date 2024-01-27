#! /bin/python
import asyncio
import websockets


async def handler(websocket):
    count = 0
    while True:
        message = await websocket.recv()
        print(message)
        print("\n----\n")

        await websocket.send("sexy man")


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()  # run forever


if __name__ == "__main__":
    asyncio.run(main())

