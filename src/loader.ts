import {plugin, service, IPluginLoader, ILogger, IConfig, ISensorManager, ISensor, ITriggerManager, IPresenceManager, IValuesManager, IClassTypeFactory} from 'homenet-core';
import {EventEmitter} from 'events';
import {connect} from './client';
import {NinjaBlockSensor} from './sensor';

// export interface PluginType { (): (typeConstructor: any) => void }
// export interface ServiceType { (serviceIdentifier: string): (target: any, targetKey: string, index?: number) => any }

// export function getPluginLoader(
//             plugin: PluginType,
//             service: ServiceType
//           ) : new (...args: any[]) => IPluginLoader {

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
          @service('ITriggerManager') triggers: ITriggerManager,
          @service('IPresenceManager') presence: IPresenceManager,
          @service('IValuesManager') values: IValuesManager,
          @service('ILogger') logger: ILogger) {

    this._logger = logger;
    this._config = config;
    this._sensors = sensors
    this._logger = logger;

    this._ninjaSensors = {};
    this._ninjaBridges = {};

    sensors.addType('ninja', this._createSensorsFactory(triggers, presence, values));
    this._init();
  }

  load() : void {
    this._logger.info('Loading ninja blocks');
  }

  _init() : void {
    this._logger.info('Starting Ninja RF sensors');

    const ninjaConfig = (<any>this._config).ninjaBlocks || {};
    const bridgeConfigs = ninjaConfig.bridges || [];

    const sensorCallback =

    bridgeConfigs.forEach(b => {
      const url: string = 'http://' + b.host + ':3000';
      this._logger.info('Connecting to ninja block ' + url);
      this._ninjaBridges[b.id] = connect(url, this._logger, (data) => {
        var ninjaSensor = this._ninjaSensors[b.id + ':' + data.deviceName];
        if (!ninjaSensor) return;
        this._logger.info('Sensor triggered from Ninjabridge ' + data.deviceName);
        ninjaSensor.trigger();
      });
    });
  }

  _createSensorsFactory(triggers: ITriggerManager, presence: IPresenceManager, values: IValuesManager) : IClassTypeFactory<ISensor> {
    const ninjaSensors = this._ninjaSensors;
    return function factory(id: string, opts: {bridge: string, deviceName: string, zone?: string, timeout?: number}) : ISensor {
      const sensor = new NinjaBlockSensor(id, opts, triggers, presence, values);
      ninjaSensors[opts.bridge + ':' + opts.deviceName] = sensor;
      return sensor;
    }
  }
}


//   return NinjaBlockPluginLoader;
// }
