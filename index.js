const BiSocket = require('./bisocket');
const clipboardSync = require('./clipboard_sync');
const mkClient = require('./mk_client');
const mkServer = require('./mk_server');
const cmdr = require('commander');

cmdr
  .option('-s, --selfAddress <address>', 'Address for this node')
  .option('-p, --peerAddress <address>', 'Address for peer node')
  .option('-m, --mode <mode>', `As a <server> node (Use this node's mouse/keyboard) or a <client> node (Use other node's mouse/keyboard)`);

cmdr.parse(process.argv);

const node = new BiSocket(
  cmdr.selfAddress,
  cmdr.peerAddress
);

if (cmdr.mode === 'server') {
  mkServer(node);
} else if (cmdr.mode === 'client') {
  mkClient(node);
} else {
  throw new Error(`Configuration Error: mode=${cmdr.mode}`);
}

node.start();

clipboardSync(node);