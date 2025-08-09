# @mhaberler/capacitor-barometer

Capacitor-Barometer is a native plugin for Capacitor that provides access to barometric pressure sensor data on supported devices. Easily integrate real-time atmospheric pressure readings into your cross-platform mobile apps for weather tracking, altitude estimation, or scientific applications.

## Install

```bash
npm install @mhaberler/capacitor-barometer
npx cap sync
```

## API

<docgen-index>

- [@mhaberler/capacitor-barometer](#mhaberlercapacitor-barometer)
  - [Install](#install)
  - [API](#api)
    - [isAvailable()](#isavailable)
    - [start(...)](#start)
    - [stop()](#stop)
    - [getPressure()](#getpressure)
    - [echo(...)](#echo)
    - [addListener('onPressureChange', ...)](#addlisteneronpressurechange-)
    - [removeAllListeners()](#removealllisteners)
    - [Interfaces](#interfaces)
      - [PluginListenerHandle](#pluginlistenerhandle)
  - [v2.0.0 Changes](#v200-changes)
    - [Optional `interval` parameter for `start()`](#optional-interval-parameter-for-start)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### isAvailable()

```typescript
isAvailable() => Promise<{ available: boolean; }>
```

Checks if the barometer sensor is available on the device.

**Returns:** <code>Promise&lt;{ available: boolean; }&gt;</code>

--------------------


### start(...)

```typescript
start(options?: { interval?: number | undefined; } | undefined) => Promise<void>
```

Starts listening for barometer updates.
This will also trigger the 'onPressureChange' event.

| Param         | Type                                |
| ------------- | ----------------------------------- |
| **`options`** | <code>{ interval?: number; }</code> |

--------------------


### stop()

```typescript
stop() => Promise<void>
```

Stops listening for barometer updates.

--------------------


### getPressure()

```typescript
getPressure() => Promise<{ pressure: number; timestamp: number; }>
```

Gets the last known pressure reading.
Ensure 'start()' has been called and data is available.

**Returns:** <code>Promise&lt;{ pressure: number; timestamp: number; }&gt;</code>

--------------------


### echo(...)

```typescript
echo(options: { value: string; }) => Promise<{ value: string; }>
```

An echo method for testing.

| Param         | Type                            |
| ------------- | ------------------------------- |
| **`options`** | <code>{ value: string; }</code> |

**Returns:** <code>Promise&lt;{ value: string; }&gt;</code>

--------------------


### addListener('onPressureChange', ...)

```typescript
addListener(eventName: 'onPressureChange', listenerFunc: (data: { pressure: number; timestamp: number; }) => void) => Promise<PluginListenerHandle> & PluginListenerHandle
```

Called when pressure data changes.

| Param              | Type                                                                     | Description                                |
| ------------------ | ------------------------------------------------------------------------ | ------------------------------------------ |
| **`eventName`**    | <code>'onPressureChange'</code>                                          | The name of the event ('onPressureChange') |
| **`listenerFunc`** | <code>(data: { pressure: number; timestamp: number; }) =&gt; void</code> | The callback function to be executed.      |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt; & <a href="#pluginlistenerhandle">PluginListenerHandle</a></code>

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

Removes all listeners for this plugin.

--------------------


### Interfaces


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |

</docgen-api>

## v2.0.0 Changes

### Optional `interval` parameter for `start()`

The `start()` method now accepts an optional `interval` parameter (Android only):

```typescript
await Barometer.start({ interval: 1000 }); // Interval in milliseconds
```

- **Android:** The `interval` sets the sensor update rate (in ms).
- **iOS:** The parameter is ignored; iOS uses the default update rate.

If omitted, the default interval
