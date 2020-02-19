const clipboardy = require('clipboardy');
const BiSocket = require('./bisocket');

const node = new BiSocket(
  process.argv[2],
  process.argv[3]
);

node.start();

let lastCp;
let cp;

node.recv((...msg) => {
  if (msg.type === 'cpSync') {
    cp = msg.data;
    if (cp !== lastCp) {
      lastCp = cp;
      console.log('sync:', cp);
      clipboardy.writeSync(msg.data);
    }
  }
});

setInterval(() => {
  cp = clipboardy.readSync();
  if (!lastCp) {
    lastCp = cp;
  }
  if (lastCp !== cp) {
    console.log('send:', cp);
    node.send({type: 'cpSync', data: cp});
    lastCp = cp;
  }

}, 1000);