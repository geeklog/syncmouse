/**
 * mk stand for mouse_keyboard
 */
const ioHook = require('iohook');
const robot = require('robotjs');

module.exports = function(node) {

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
      node.send({type:'move', pos});
    }
  })();

  const screen = robot.getScreenSize();

  ioHook.disableClickPropagation();
  
  ioHook.on('mousemove', ({type, x, y}) => {
    console.log('mousemove', x, y);
    sendMousePos(x, y);
  });
  
  ioHook.on('mouseclick', ({type}) => {
    console.log('mouseclick');
    node.send({type: 'click'});
  });

  ioHook.on('mousewheel', ({type, rotation, amount, clicks, direction }) => {
    console.log('mousewheel', rotation * amount);
    node.send({type: 'scroll', span: rotation * amount});
  })
  
  ioHook.on('mousedrag', msg => {
    node.send({
      type: 'drag',
      px: msg.x / screen.width, 
      py: msg.y / screen.height
    });
  });
  
  ioHook.on('mouseup', msg => {
    node.send({ type: 'mouseup' });
  });

  ioHook.on('keypress',function(msg) {
    console.log('keypress', msg);
  });

  ioHook.on('keydown',function(msg) {
    console.log('keydown', msg);
  });
  
  ioHook.on('keyup',function(msg) {
    console.log('keyup', msg);
  });

  // const CTRL = 29;
  // const ALT = 56;
  // const F7 = 65;

  // ioHook.registerShortcut([F7], (keys) => {
  //   console.log('Shortcut pressed with keys:', keys);
  // });

  ioHook.start();
}
