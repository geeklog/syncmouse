const robot = require("robotjs");
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ioHook = require('iohook');
const dgram = require('dgram');
const udpClient = dgram.createSocket('udp4');
const screen = robot.getScreenSize();

app.set('view engine', 'pug');
app.set('views', '.');

app.get('/', (req, res) => {
  res.render('index');
})

let uuid = 1;
let clients = [];

io.on('connection', function(socket) {
  socket.uuid = uuid++;
  clients.push(socket);
  socket.on('disconnect', function () {
    delete socket.uuid;
    clients = clients.filter(sock => !!sock.uuid);
  });
});

http.listen(3001, function() {
  console.log('listening on *:3001');
});

function send(msg) {
  const json = JSON.stringify(msg);
  for (const client of clients) {
    if (client.uuid) {
      client.send(json);
    }
  }
  udpClient.send(Buffer.from(json), 33333, '192.168.1.219');
}

const sendMousePos = (function () {
  let prePos;
  
  return function(x, y) {
    const pos = {
      px: x / screen.width,
      py: y / screen.height
    }
    if (prePos && prePos.px === pos.px && prePos.py === pos.py) {
      return;
    }
    prePos = pos;
    send({type:'move', pos});
  }
})();

ioHook.disableClickPropagation();

ioHook.on('mousemove', ({type, x, y}) => {
  sendMousePos(x, y);
});
ioHook.on('mouseclick', ({type}) => {
  send({type: 'click'});
});
ioHook.on('mousewheel', ({type, rotation, amount, clicks, direction }) => {
  console.log({type, rotation, amount, clicks, direction });
  send({type: 'scroll', span: rotation * amount});
})
ioHook.on('mousedrag', msg => {
  send({
    type: 'drag',
    px: msg.x / screen.width, 
    py: msg.y / screen.height
  });
});
ioHook.on('mouseup', msg => {
  console.log(msg);
  send({ type: 'mouseup' });
});

const CTRL = 29;
const ALT = 56;
const F7 = 65;

ioHook.registerShortcut([F7], (keys) => {
  console.log('Shortcut pressed with keys:', keys);
});

ioHook.start();

// setInterval(() => {
//   const {x, y} = robot.getMousePos();
//   sendMousePos(x, y);
// }, 1000/60);
