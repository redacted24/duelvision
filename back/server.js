const http = require('http')

const ws = new require('ws');
const wss = new ws.Server({noServer: true});

const clients = new Set();

const app = http.createServer((req, res) => {
  wss.handleUpgrade(req, res.socket, Buffer.alloc(0), onSocketConnect)
})

const onSocketConnect = (ws) => {
  clients.add(ws);
  console.log(`new connection`);

  ws.on('message', (message) => {
    console.log(`message received: ${message}`)

    message = message.slice(0, 50)

    for(let client of clients) {
      client.send(message);
    }
  });

  ws.on('close', function() {
    console.log(`connection closed`)
    clients.delete(ws)
  });
}

const PORT = 3000
app.listen(PORT)
console.log(`Server running on port ${PORT}`)