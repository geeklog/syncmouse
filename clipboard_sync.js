const clipboardy = require('clipboardy');

module.exports = function clipboardSync(node) {
  let lastCp;
  let cp;
  
  node.recv(msg => {
    if (msg.type === 'cpSync') {
      cp = msg.data;
      if (cp !== lastCp) {
        lastCp = cp;
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
}
