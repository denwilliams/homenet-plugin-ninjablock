import { ISensor, ISensorOpts, ITriggerManager, IPresenceManager, IValuesManager } from '@homenet/core';
import { EventEmitter } from 'events';
import chalk = require('chalk');

export class NinjaBlockSensor extends EventEmitter implements ISensor {
  public opts: ISensorOpts;
  public isTrigger: boolean;
  public isToggle: boolean;
  public isValue: boolean;

  constructor(
          instanceId: string,
          opts: {bridge: string, deviceName: string, zone?: string, timeout?: number}
          ) {
    super();
    this.isTrigger = true;
    this.isValue = true;
    this.isToggle = false;
    this.opts = opts;
  }
}
