module.exports = class BiSocket {

  constructor(servAddress, peerAddress) {
    this.servAddress = servAddress;
    this.peerAddress = peerAddress;
    const app = this.app = require('express')();
    const http = this.http = require('http').Server(app);
    this.server = require('socket.io')(http);
    this.client = require('socket.io-client')(peerAddress);
    this.onRecvs = [];
  }

  start() {
    this.server.on('connection', (socket) => {
      console.log('peer client connected');
      this.peerSocket = socket;
      socket.on('disconnect', function () {
        console.log('peer client disconnected');
        this.peerSocket = null;
      });
      socket.on('message', (msg) => {
        console.log('recv:', msg);
        for (const recv of this.onRecvs) {
          recv(msg);
        }
      })
    });

    const servPort = Number(this.servAddress.split(':').pop())
    this.http.listen(servPort);
    console.log(`serve at: ${servPort}`);

    this.client.connect(this.peerAddress);
    this.client.on('connect', function() {
      console.log('peer server connected');
    });
    this.client.on('event', function(data) {
      console.log('data');
    });
    this.client.on('disconnect', function(){
      console.log('peer server disconnected');
    });
  }

  send(msg) {
    this.client.send(msg);
  }

  recv(callback) {
    this.onRecvs.push(callback);
  }

}

