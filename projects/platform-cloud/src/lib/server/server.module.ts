import { CommonModule, DOCUMENT, PlatformLocation, ViewportScroller } from '@angular/common';
import { ApplicationModule, NgModule, NgZone, RendererFactory2, StaticProvider } from '@angular/core';
import { MessageBus, ObjectStore, Serializer, SharedStylesHost, RendererAdapter2, LocationAdapter } from '../shared';
import { ServerMessageBus } from './server-bus';
import { ServerGlobalEvents } from './server-global-events';
import { ServerPlatformLocation } from './server-location';
import { ServerLocationAdapter } from './server-location-adapter';
import { DEFAULT_LOCATION_STATE, ServerLocationState } from './server-location-state';
import { ServerRendererFactory2 } from './server-renderer';
import { ServerStylesHost } from './server-styles';
import { ServerViewportScroller } from './server-viewport-scroller';
import { BrowserCommandSubject, ServerCommandSubject } from './server-message-subject';
import { ServerRendererAdapter2 } from './server-renderer-adapter';

export const PLATFORM_CLOUD_SERVER_TRANSIENT_PROVIDERS: StaticProvider[] = [
  { provide: ServerGlobalEvents, useClass: ServerGlobalEvents, deps: [] },
  { provide: ObjectStore, useClass: ObjectStore, deps: [] },
  { provide: Serializer, useClass: Serializer, deps: [ObjectStore] },
  { provide: ServerLocationState, useClass: ServerLocationState, deps: [DEFAULT_LOCATION_STATE] },
  { provide: ViewportScroller, useClass: ServerViewportScroller, deps: [] },
  { provide: LocationAdapter, useClass: ServerLocationAdapter, deps: [MessageBus, ServerLocationState, Serializer] },
  { provide: PlatformLocation, useClass: ServerPlatformLocation, deps: [LocationAdapter, MessageBus, ServerLocationState, ObjectStore] },
  { provide: MessageBus, useClass: ServerMessageBus, deps: [ServerCommandSubject, BrowserCommandSubject] },
  { provide: RendererFactory2, useClass: ServerRendererFactory2, deps: [SharedStylesHost, MessageBus, ObjectStore, RendererAdapter2, ServerGlobalEvents] },
  { provide: SharedStylesHost, useClass: ServerStylesHost, deps: [DOCUMENT] },
  { provide: RendererAdapter2, useClass: ServerRendererAdapter2, deps: [MessageBus, Serializer, ServerGlobalEvents, NgZone] }
];

@NgModule({
  exports: [
    ApplicationModule,
    CommonModule
  ],
  providers: PLATFORM_CLOUD_SERVER_TRANSIENT_PROVIDERS
})
export class CloudServerModule {}
