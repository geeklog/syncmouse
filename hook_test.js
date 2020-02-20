const ioHook = require('iohook');

// ioHook.on('mousemove', (msg) => {
//   console.log(msg);
// });

// ioHook.on('mouseclick', (msg) => {
//   console.log(msg);
// });

// ioHook.on('mousewheel', (msg) => {
//   console.log(msg);
// });

// ioHook.on('mousedrag', msg => {
//     console.log(msg);
// });

// ioHook.on('mouseup', msg => {
//   console.log(msg);
// });

// ioHook.on('keypress',function(msg) {
//   console.log(msg);
// });

// ioHook.on('keydown',function(msg) {
//   console.log(msg);
// });

ioHook.on('keyup',function(msg) {
  console.log('', msg.keycode);
});

ioHook.start();
// ioHook.setDebug(true);