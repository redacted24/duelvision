#! /bin/python

import asyncio
import websockets
import time
import json


async def sender():
    url = "ws://34.125.205.166:80"
    connection = False
    async with websockets.connect(url) as w:
        try:
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

                blob_dict["x"] = "bob"
                await w.send(json.dumps(blob_dict))

        except websockets.exceptions.ConnectionClosedOK:
            await sender()

        except KeyboardInterrupt:
            #await w.close()
            print("bye")

            



asyncio.run(sender())
