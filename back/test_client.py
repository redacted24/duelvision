#! /bin/python

import asyncio
import websockets


async def sender():

    url = "ws://127.0.0.1:8001"
    async with websockets.connect(url) as w:
        await w.send("heyhey")
        #while True:
        #    msg = await w.recv()
        #    print(msg)

asyncio.run(sender())
