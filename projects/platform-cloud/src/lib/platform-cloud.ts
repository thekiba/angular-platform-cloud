import { DOCUMENT, PlatformLocation, ViewportScroller } from '@angular/common';
import { createPlatformFactory, platformCore, PlatformRef, RendererFactory2, StaticProvider } from '@angular/core';
import { isDevMode, NgZone } from '@angular/core';
import { ErrorHandler } from '@angular/core';
import { ɵBROWSER_SANITIZATION_PROVIDERS as BROWSER_SANITIZATION_PROVIDERS } from '@angular/platform-browser';
import { ServerMessageBus } from './server/server-bus';
import { ServerPlatformLocation } from './server/server-location';
import { ServerRenderer2Factory } from './server/server-renderer';
import { ServerStylesHost } from './server/server-styles';
import { ServerViewportScroller } from './server/server-viewport-scroller';
import { MessageBus, ObjectStore, Serializer, SharedStylesHost } from './shared';

export { CloudServerModule } from './server';
export { CloudBrowserModule } from './browser';

export const PLATFORM_CLOUD_SHARED_PROVIDERS: StaticProvider[] = [
  {provide: NgZone, useFactory: createNgZone, deps: []}
];

export const PLATFORM_CLOUD_SERVER_PROVIDERS: StaticProvider[] = [
  BROWSER_SANITIZATION_PROVIDERS,
  { provide: ErrorHandler, useFactory: errorHandler, deps: [] },
  { provide: DOCUMENT, useValue: {} }
];

export const PLATFORM_CLOUD_BROWSER_PROVIDERS: StaticProvider[] = [];


export const platformCloudServer =
  createPlatformFactory(platformCore, 'cloudServer', [PLATFORM_CLOUD_SHARED_PROVIDERS, PLATFORM_CLOUD_SERVER_PROVIDERS]);

export const platformCloudBrowser =
  createPlatformFactory(platformCore, 'cloudBrowser', [PLATFORM_CLOUD_SHARED_PROVIDERS, PLATFORM_CLOUD_BROWSER_PROVIDERS]);


export function bootstrapCloudServer(customProviders: StaticProvider[] = []): Promise<PlatformRef> {
  const platform = platformCloudServer(customProviders);
  return Promise.resolve(platform);
}

export function bootstrapCloudBrowser(customProviders: StaticProvider[] = []): Promise<PlatformRef> {
  const platform = platformCloudBrowser(customProviders);
  return Promise.resolve(platform);
}

function createNgZone(): NgZone {
  return new NgZone({enableLongStackTrace: isDevMode()});
}

function errorHandler(): ErrorHandler {
  return new ErrorHandler();
}
