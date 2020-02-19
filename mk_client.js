/**
 * mk stand for mouse_keyboard
 */
const robot = require('robotjs');

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

  node.recv(msg => {
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
      const x = screen.width * msg.px;
      const y = screen.height * msg.py;
      if (mouseState !== 'down') {
        robot.mouseToggle('down');
        mouseState = 'down';
      }
      robot.dragMouse(x, y);
    }
    if (msg.type === 'mouseup') {
      robot.mouseToggle('up');
      mouseState = 'up';
    }
  });
}