/**
 * mk stand for mouse_keyboard
 */
const ioHook = require('iohook');
const robot = require('robotjs');

module.exports = function(node) {
  node.connected(() => {
    const screen = robot.getScreenSize();
    node.send({
      type: 'screen',
      width: screen.width,
      height: screen.height
    });
  });

  // ioHook.disableClickPropagation();

  ioHook.on('mousemove', (msg) => node.send(msg));
  ioHook.on('mousedrag', msg => node.send(msg));
  ioHook.on('mousewheel', (msg) => node.send(msg));
  ioHook.on('mouseclick', (msg) => node.send(msg));
  ioHook.on('mouseup', (msg) => node.send(msg));
  ioHook.on('keypress', (msg) => node.send(msg));
  ioHook.on('keydown', (msg) => node.send(msg));
  ioHook.on('keyup', (msg) => node.send(msg));

  ioHook.start();
};
