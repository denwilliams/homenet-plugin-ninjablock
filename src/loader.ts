import {plugin, service, IPluginLoader, ILogger, IConfig, ISensorManager, ISensor} from 'homenet-core';
import {EventEmitter} from 'events';
import {connect} from './client';

@plugin()
export class NinjaBlockPluginLoader implements IPluginLoader {

  private _logger : ILogger;
  private _config : IConfig;
  private _sensors : ISensorManager;

  constructor(
          @service('IConfig') config: IConfig,
          @service('ISensorManager') sensors: ISensorManager,
          @service('ILogger') logger: ILogger) {
    this._logger = logger;
    this._sensors = sensors
    this._logger = logger;
  }

  load() : void {
    this._logger.info('Loading ninja blocks');
  }
}

function factory(sensors: any, config: IConfig, logger: ILogger) {
  logger.info('Starting Ninja RF sensors');

  var ninjaConfig = config.ninjaBlocks || {};
  var bridgeConfigs = ninjaConfig.bridges || [];
  var ninjaSensors = ninjaConfig.sensors || {};

  var bridges = {};
  var svc = {};

  bridgeConfigs.forEach(function(b) {
    var url = 'http://' + b.host + ':3000';
    bridges[b.id] = connect(url, ninjaSensors, sensors, logger);
  });

  return svc;
}
