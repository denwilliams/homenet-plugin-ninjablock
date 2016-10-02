import {plugin, service, IPluginLoader, ILogger, IConfig, ISensorManager, ISensor, ITriggerManager, IPresenceManager, IValuesManager, IClassTypeFactory} from 'homenet-core';
import {EventEmitter} from 'events';
import {connect} from './client';
import {NinjaBlockSensor} from './sensor';

@plugin()
export class NinjaBlockPluginLoader implements IPluginLoader {
  private _logger : ILogger;
  private _config : IConfig;
  private _sensors : ISensorManager;
  private _ninjaBridges : Object;
  private _ninjaSensors: Object;

  constructor(
          @service('IConfig') config: IConfig,
          @service('ISensorManager') sensors: ISensorManager,
          @service('ILogger') logger: ILogger) {

    this._logger = logger;
    this._config = config;
    this._sensors = sensors
    this._logger = logger;

    this._ninjaSensors = {};
    this._ninjaBridges = {};

    sensors.addType('ninja', this._createSensorsFactory());
    sensors.addType('ninja-trigger', this._createSensorsFactory('trigger'));
    sensors.addType('ninja-temperature', this._createSensorsFactory('value'));
    sensors.addType('ninja-humidity', this._createSensorsFactory('value'));
    this._init();
  }

  load() : void {
    this._logger.info('Loading ninja blocks');
  }

  _init() : void {
    this._logger.info('Starting Ninja RF sensors');

    const ninjaConfig = (<any>this._config).ninjaBlocks || {};
    const bridgeConfigs = ninjaConfig.bridges || [];

    bridgeConfigs.forEach(b => {
      const url: string = `http://${b.host}:3000`;
      const bridgeId = b.id;
      this._logger.info(`Connecting to ninja block ${url}`);
      this._ninjaBridges[bridgeId] = connect(url, this._logger, (e) => {
        var ninjaSensor: NinjaBlockSensor = this._ninjaSensors[bridgeId + ':' + (e.deviceName || e.device)];
        if (!ninjaSensor) return;
        switch (e.type) {
          case 'humidity':
          case 'temperature':
          case 'eyes':
          case 'statuslight':
            ninjaSensor.emit('value', e.type, e.data);
            break;
          default:
            this._logger.info('Sensor triggered from Ninjabridge ' + (e.deviceName || e.device));
            ninjaSensor.emit('trigger');
            break;
        }
      });
    });
  }

  _createSensorsFactory(type?: 'trigger' | 'value') : IClassTypeFactory<ISensor> {
    const ninjaSensors = this._ninjaSensors;
    return function factory(id: string, opts: {bridge: string, deviceName: string, zone?: string, timeout?: number}) : ISensor {
      const sensor = new NinjaBlockSensor(id, opts);
      if (!type || type === 'trigger') {
        sensor.isTrigger = true;
        sensor.isToggle = false;
        sensor.isValue = false;
      } else if (type && type === 'value') {
        sensor.isTrigger = false;
        sensor.isToggle = false;
        sensor.isValue = true;
      }
      ninjaSensors[opts.bridge + ':' + opts.deviceName] = sensor;
      return sensor;
    }
  }
}
