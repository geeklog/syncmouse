const ioHook = require('iohook');

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
});

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

ioHook.start();
ioHook.setDebug(true);