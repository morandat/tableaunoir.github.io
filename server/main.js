const WebSocket = require('ws');
const generateID = require("uuid/v4")

const tableaunoirs = {};

class TableauNoir {
  constructor() {
    this.sockets = [];
  }

  addSocket(socket) {
    this.sockets.push(socket);
  }

  dispatch(msg) {
    this.sockets.forEach(s => s.send(msg));
  }
}

const server = new WebSocket.Server({
  port: 443
});

let sockets = [];

server.on('connection', function (socket) {
  sockets.push(socket);

  socket.on('message', function (msg) {
    console.log(msg);
    msg.socket = socket;
    treatReceivedMessageFromClient(JSON.parse(msg));
  });

  socket.on('close', function () {
    sockets = sockets.filter(s => s !== socket);
  });
});



function treatReceivedMessageFromClient(msg) {
  switch (msg.type) {
    case "share":
      let id = generateID();
      tableaunoirs[id] = new TableauNoir();
      tableaunoirs[id].addSocket(msg.socket);
      socket.send(JSON.stringify({ type: "id", id: id }));
      break;

    case "join":
      let id = msg.id;
      if (tableaunoirs[id] == undefined) {
        console.log("there is no tableaunoir of id " + id);
        return;
      }
      tableaunoirs[id].addSocket(msg.socket);
      break;
  }
}