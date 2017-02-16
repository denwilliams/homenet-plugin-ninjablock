declare module 'homenet-plugin-ninjablock' {
  import { IPluginLoader } from '@homenet/core';
  export var NinjaBlockPluginLoader: new (...args: any[]) => IPluginLoader
  // export interface PluginType { (): (typeConstructor: any) => void }
  // export interface ServiceType { (serviceIdentifier: string): (target: any, targetKey: string, index?: number) => any }
  //
  // export function getPluginLoader(plugin: PluginType, service: ServiceType) : new (...args: any[]) => IPluginLoader;
}
