import socketIo = require('socket.io-client');
import { ILogger } from 'homenet-core';

export interface ISensorCallback { (data: {event: string, device: string, deviceName: string, type: string, data: string}) : void; }

export function connect(url: string, logger: ILogger, sensorCallback: ISensorCallback) {

  logger.info('Connecting to bridge ' + url);

  var socket = socketIo(url);

  socket.on('connect', function() {
    logger.info('Ninjabridge connected');
  });
  socket.on('disconnect', function() {
    logger.info('Ninjabridge disconnected');
  });

  socket.on('0_0_11.rfsensor', function(data){
    logger.debug('Got RF sensor data ' + JSON.stringify(data));
    sensorCallback(data);
  });

  // socket.on('event', function(data) {
  //  console.log('event', data);
  // });

  return socket;
}
