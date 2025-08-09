import type { PluginListenerHandle } from '@capacitor/core';
import { WebPlugin } from '@capacitor/core';

import type { Barometer as BarometerInterface } from './definitions';

export class BarometerWeb extends WebPlugin implements BarometerInterface {
  constructor() {
    super();
  }

  async isAvailable(): Promise<{ available: boolean }> {
    console.log('Barometer: isAvailable called on web');
    return { available: false }; // Typically not available on web
  }

  async start(options?: { interval?: number }): Promise<void> {
    console.log('Barometer: start called on web - not implemented', options);
    // No-op on web, or throw an error if preferred
    return Promise.resolve();
  }

  async stop(): Promise<void> {
    console.log('Barometer: stop called on web - not implemented');
    // No-op on web
    return Promise.resolve();
  }

  async getPressure(): Promise<{ pressure: number; timestamp: number}> {
    console.log('Barometer: getPressure called on web - not implemented');
    throw this.unavailable('Barometer functionality is not available on the web.');
  }

  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO web', options);
    return options;
  }
  
  addListener(
    eventName: 'onPressureChange',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _listenerFunc: (data: { pressure: number, timestamp: number }) => void,
  ): Promise<PluginListenerHandle> & PluginListenerHandle {
    if (eventName === 'onPressureChange') {
      console.warn('Barometer onPressureChange event not supported on web.');
      // Return a mock handle that does nothing
      const handle = { remove: async () => {} } as PluginListenerHandle;
      return Promise.resolve(handle) as Promise<PluginListenerHandle> & PluginListenerHandle;
    }
    // For other events, you might call super or throw an error
    throw this.unimplemented(`Event ${eventName} not supported on web.`);
  }

  // removeAllListeners() is inherited from WebPlugin and should work fine.
}
