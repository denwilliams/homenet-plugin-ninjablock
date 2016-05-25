import socketIo = require('socket.io-client');

export function connect(url, ninjaSensors, sensors, logger) {

  logger.info('Connecting to bridge ' + url);

  var socket = socketIo(url);

  socket.on('connect', function() {
    logger.info('Ninjabridge connected');
  });
  socket.on('disconnect', function() {
    logger.info('Ninjabridge disconnected');
  });

  socket.on('0_0_11.rfsensor', function(data){
    logger.info('Got RF sensor data ' + JSON.stringify(data));
    var homenetSensorId = ninjaSensors[data.deviceName];
    if (!homenetSensorId) return;
    logger.info('Sensor triggered from Ninjabridge ' + homenetSensorId);
    sensors.trigger(homenetSensorId, true);
    //console.log('0_0_11.rfsensor', data);
  });

  // socket.on('event', function(data) {
  //  console.log('event', data);
  // });

  return socket;
}