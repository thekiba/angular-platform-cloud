import { CommonModule, DOCUMENT, PlatformLocation, ViewportScroller } from '@angular/common';
import { ApplicationModule, NgModule, NgZone, RendererFactory2, StaticProvider } from '@angular/core';

import { LocationAdapter, MessageBus, ObjectStore, RendererAdapter2, Serializer, SharedStylesHost } from '../shared';
import { ServerMessageBus } from './server-bus';
import { ServerGlobalEvents } from './server-global-events';
import { ServerPlatformLocation } from './server-location';
import { ServerLocationAdapter } from './server-location-adapter';
import { DEFAULT_LOCATION_STATE, ServerLocationState } from './server-location-state';
import { BrowserCommandSubject, ServerCommandSubject } from './server-message-subject';
import { ServerRendererFactory2 } from './server-renderer';
import { ServerRendererAdapter2 } from './server-renderer-adapter';
import { ServerStylesHost } from './server-styles';
import { ServerViewportScroller } from './server-viewport-scroller';

export const PLATFORM_CLOUD_SERVER_TRANSIENT_PROVIDERS: StaticProvider[] = [
  { provide: ServerGlobalEvents, useClass: ServerGlobalEvents, deps: [] },
  { provide: ObjectStore, useClass: ObjectStore, deps: [] },
  { provide: Serializer, useClass: Serializer, deps: [ObjectStore] },
  { provide: ServerLocationState, useClass: ServerLocationState, deps: [DEFAULT_LOCATION_STATE] },
  { provide: ViewportScroller, useClass: ServerViewportScroller, deps: [] },
  { provide: LocationAdapter, useClass: ServerLocationAdapter, deps: [MessageBus, ServerLocationState, Serializer] },
  { provide: PlatformLocation, useClass: ServerPlatformLocation, deps: [LocationAdapter, MessageBus, ServerLocationState, ObjectStore] },
  { provide: MessageBus, useClass: ServerMessageBus, deps: [ServerCommandSubject, BrowserCommandSubject] },
  {
    provide: ServerRendererFactory2,
    useClass: ServerRendererFactory2,
    deps: [SharedStylesHost, MessageBus, ObjectStore, RendererAdapter2, ServerGlobalEvents]
  },
  { provide: SharedStylesHost, useClass: ServerStylesHost, deps: [DOCUMENT] },
  { provide: RendererAdapter2, useClass: ServerRendererAdapter2, deps: [MessageBus, Serializer, ServerGlobalEvents, NgZone] },
  { provide: RendererFactory2, useExisting: ServerRendererFactory2 },
];

@NgModule({
  exports: [
    ApplicationModule,
    CommonModule
  ],
  providers: [
    PLATFORM_CLOUD_SERVER_TRANSIENT_PROVIDERS
  ]
})
export class CloudServerModule {}
