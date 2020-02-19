const robot = require('robotjs');
const _ = require('lodash');
const socketClient = require('socket.io-client');
const socket = socketClient.connect('http://192.168.1.7:3000', {reconnect: true});

socket.on('connect', socket => {
  console.log('connected!');
});
socket.emit('FFFFF');


var PORT = 33333;
var HOST = '0.0.0.0';

var dgram = require('dgram');
var udpServer = dgram.createSocket('udp4');
const screen = robot.getScreenSize();
robot.setMouseDelay(0);

udpServer.on('listening', function () {
  var address = udpServer.address();
  console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

const moveMouseThrottled = _.throttle((x, y) => {
  robot.moveMouse(x, y);
}, 10);

const mouseMovePoses = [];
setInterval(() => {
  let pos;
  while (mouseMovePoses.length > 6) {
    mouseMovePoses.shift();
  }
  pos = mouseMovePoses.shift();
  if (!pos) return;
  robot.moveMouse(pos.x, pos.y);
}, 0);

const mouseDragPoses = [];
setInterval(() => {
  let pos;
  while (mouseDragPoses.length > 6) {
    mouseDragPoses.shift();
  }
  pos = mouseDragPoses.shift();
  if (!pos) return;
  console.log(pos);
  
  robot.dragMouse(pos.x, pos.y);
}, 0);

let mouseState;

udpServer.on('message', function (message, remote) {
  const msg = JSON.parse(message);
  if (msg.type === 'click') {
    robot.mouseClick();
    mouseState = 'up';
    return;
  }
  if (msg.type === 'scroll') {
    robot.scrollMouse(0, -msg.span);
  }
  if (msg.type === 'move') {
    const x = screen.width * msg.pos.px;
    const y = screen.height * msg.pos.py;
    mouseMovePoses.push({x, y});
  }
  if (msg.type === 'drag') {
    console.log(msg);
    const x = screen.width * msg.px;
    const y = screen.height * msg.py;
    if (mouseState !== 'down') {
      robot.mouseToggle('down');
      mouseState = 'down';
    }
    robot.dragMouse(x, y);
    // mouseDragPoses.push({x, y});
  }
  if (msg.type === 'mouseup') {
    console.log(msg);
    robot.mouseToggle('up');
    mouseState = 'up';
  }
});

udpServer.bind(PORT, HOST);