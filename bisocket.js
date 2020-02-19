module.exports = class BiSocket {

  constructor(servAddress, peerAddress) {
    this.servAddress = servAddress;
    this.peerAddress = peerAddress;
    const app = this.app = require('express')();
    const http = this.http = require('http').Server(app);
    this.server = require('socket.io')(http);
    this.client = require('socket.io-client')(peerAddress);
    this.onConnecteds = [];
    this.onRecvs = [];
  }

  start() {
    this.server.on('connection', (socket) => {
      console.log('peer client connected');
      this.peerSocket = socket;
      this.peerClientConnected = true;
      socket.on('disconnect', function () {
        console.log('peer client disconnected');
        this.peerSocket = null;
        this.peerClientConnected = false;
      });
      socket.on('message', (msg) => {
        for (const recv of this.onRecvs) {
          recv(msg);
        }
      });
      this.checkConnection();
    });
    
    const servPort = Number(this.servAddress.split(':').pop());
    this.http.listen(servPort);
    console.log(`serve at: ${this.servAddress}`);

    this.client.connect(this.peerAddress);
    this.client.on('connect', () => {
      console.log('peer server connected');
      this.peerServerConnected = true;
      this.checkConnection();
    });
    this.client.on('event', (data) => {
      console.log(data);
    });
    this.client.on('disconnect', () => {
      console.log('peer server disconnected');
      this.peerServerConnected = false;
    });
  }

  connected(callback) {
    this.onConnecteds.push(callback);
  }

  send(msg) {
    this.client.send(msg);
  }

  recv(callback) {
    this.onRecvs.push(callback);
  }

  checkConnection() {
    if (this.peerClientConnected && this.peerServerConnected) {
      for (const callback of this.onConnecteds) {
        callback();
      }
    }
  }
};
