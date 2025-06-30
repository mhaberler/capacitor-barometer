import { WebPlugin } from '@capacitor/core';
import type { PluginListenerHandle } from '@capacitor/core';

import type { Barometer } from './definitions';

// --- Configuration Flag for Web Simulation ---
//  **URL Query Parameter (Quick for local testing):**
//    Access `window.location.search`. Example: `http://localhost:8100?simulateBarometer=true`
//    `const urlParams = new URLSearchParams(window.location.search);`
//    `const SIMULATE_BAROMETER = urlParams.get('simulateBarometer') === 'true';`
const urlParams = new URLSearchParams(window.location.search);

const SIMULATE_BAROMETER_DATA_ON_WEB = urlParams?.get('simulateBarometer') === 'true'; 

const sineAmplitude = 10; // meters  
const sineFrequency = 0.02; // Hz
const verticalNoiseMeters = 0.1; // meters 
const startPressure = 900; // hPa
const metersPerHpa = 8;
const baroRate = 100; // ms

export class BarometerWeb extends WebPlugin implements Barometer {
  private intervalId: any;
  private currentPressure = startPressure; // Initial atmospheric pressure in hPa
  private startTimestamp: number = Date.now();


  constructor() {
    super(); // No arguments to super() for WebPlugin

    if (!SIMULATE_BAROMETER_DATA_ON_WEB) {
      console.warn(
        'BarometerWeb: Simulation is disabled. Methods will throw "unavailable" errors.'
      );
    } else {
      console.info('BarometerWeb: Simulation is enabled.');
    }
  }

  // Helper to throw an unavailable error
  private throwUnavailable(): Promise<never> {
    return Promise.reject(this.unavailable('Barometer not available on web.'));
  }

  async isAvailable(): Promise<{ available: boolean }> {
    return { available: SIMULATE_BAROMETER_DATA_ON_WEB };
  }

  async echo(options: { value: string }): Promise<{ value: string }> {
    if (!SIMULATE_BAROMETER_DATA_ON_WEB) {
      return this.throwUnavailable();
    }
    return { value: options.value };
  }

  async start(): Promise<void> {
    if (!SIMULATE_BAROMETER_DATA_ON_WEB) {
      return this.throwUnavailable();
    }

    if (this.intervalId) {
      console.warn('Barometer simulation already started.');
      return;
    }

    console.log('Starting simulated barometer...');
    this.intervalId = setInterval(() => {
      this.currentPressure =  startPressure + this.simulatePressureChange((Date.now() - this.startTimestamp) / 1000.0);
      const reading = {
        pressure: this.currentPressure,
        timestamp: Date.now()/1000,
      };
      // Use notifyListeners to emit events through the WebPlugin's built-in system
      this.notifyListeners('onPressureChange', reading);
    }, baroRate);
  }

  async stop(): Promise<void> {
    if (!SIMULATE_BAROMETER_DATA_ON_WEB) {
      return this.throwUnavailable();
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      console.log('Stopped simulated barometer.');
    }
  }

  async getPressure(): Promise<{ pressure: number; timestamp: number }> {
    if (!SIMULATE_BAROMETER_DATA_ON_WEB) {
      return this.throwUnavailable();
    }
    return {
      pressure: this.currentPressure,
      timestamp: Date.now(),
    };
  }

  addListener(
    eventName: 'onPressureChange',
    listenerFunc: (data: { pressure: number; timestamp: number }) => void,
  ): Promise<PluginListenerHandle> & PluginListenerHandle {
    if (!SIMULATE_BAROMETER_DATA_ON_WEB) {
      throw this.unavailable('Barometer not available on web.');
    }

    const handle = super.addListener(eventName, listenerFunc);
    // Create the intersection type by extending the promise with the handle properties
    Object.assign(handle, {
      remove: async () => {
        const resolvedHandle = await handle;
        return resolvedHandle.remove();
      }
    });

    return handle as Promise<PluginListenerHandle> & PluginListenerHandle;
  }

  async removeAllListeners(): Promise<void> {
    if (!SIMULATE_BAROMETER_DATA_ON_WEB) {
      return this.throwUnavailable();
    }
    return super.removeAllListeners();
  }


  private simulatePressureChange(timeDiff: number): number {
    const noise = (Math.random() - 0.5) * verticalNoiseMeters / metersPerHpa;
    const sineWave = sineAmplitude * Math.sin((timeDiff * 2 * Math.PI) * sineFrequency) / metersPerHpa;
    return noise + sineWave;
  }
}
