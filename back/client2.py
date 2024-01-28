#! /bin/python

import asyncio
import websockets
import time
import json


async def sender():
    url = "ws://127.0.0.1:8001"
    connection = False
    async with websockets.connect(url) as w:
        while True:
            msg = await w.recv()
            print(msg)
            if not connection:
                if msg == "hello":
                    await w.send("hello")
                    connection = True
                    continue

            if msg == "hello":
                print("hello again")
                continue
            blob_dict = json.loads(msg)

            if blob_dict["status_wait"] == True:
                continue

            blob_dict["x"] = "adam"
            await w.send(json.dumps(blob_dict))

            


            print(msg)

asyncio.run(sender())
