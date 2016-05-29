import {TriggerSensor, ISensor, ITriggerManager, IPresenceManager, IValuesManager} from 'homenet-core';
import chalk = require('chalk');

export class NinjaBlockSensor extends TriggerSensor implements ISensor {
  constructor(
          instanceId: string,
          opts: {bridge: string, deviceName: string, zone?: string, timeout?: number},
          triggers: ITriggerManager,
          presence: IPresenceManager,
          values: IValuesManager) {
    super(instanceId, opts, triggers, presence, values);
  }
}
