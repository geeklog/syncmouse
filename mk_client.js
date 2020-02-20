/**
 * mk stand for mouse_keyboard
 */
const robot = require('robotjs');
const { keyChars } = require('./keymap');

module.exports = function(node) {
  const screen = robot.getScreenSize();
  robot.setMouseDelay(0);

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
  let peerScreen;

  node.recv(msg => {
    if (msg.type === 'screen') {
      peerScreen = { width: msg.width, height: msg.height };
      return;
    }
    if (msg.type === 'mouseclick') {
      robot.mouseClick();
      mouseState = 'up';
      return;
    }
    if (msg.type === 'mousewheel') {
      robot.scrollMouse(0, -msg.rotation * msg.amount);
      return;
    }
    if (msg.type === 'mousemove') {
      const x = screen.width * msg.x / peerScreen.width;
      const y = screen.height * msg.y / peerScreen.height;
      mouseMovePoses.push({x, y});
      return;
    }
    if (msg.type === 'mousedrag') {
      const x = screen.width * msg.x / peerScreen.width;
      const y = screen.height * msg.y / peerScreen.height;
      if (mouseState !== 'down') {
        robot.mouseToggle('down');
        mouseState = 'down';
      }
      robot.dragMouse(x, y);
      return;
    }
    if (msg.type === 'mouseup') {
      robot.mouseToggle('up');
      mouseState = 'up';
      return;
    }
    if (msg.type === 'keyup') {
      robot.keyToggle(keyChars[msg.keycode], 'up');
      return;
    }
    if (msg.type === 'keydown') {
      robot.keyToggle(keyChars[msg.keycode], 'down');
      return;
    }

    console.log('unkown event', msg);
  });
};