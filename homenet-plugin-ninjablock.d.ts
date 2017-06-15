declare module 'homenet-plugin-ninjablock' {
  import { IPluginLoader } from '@homenet/core';
  export function create(annotate: any): { NinjaBlockPluginLoader: new (...args: any[]) => IPluginLoader }
}
