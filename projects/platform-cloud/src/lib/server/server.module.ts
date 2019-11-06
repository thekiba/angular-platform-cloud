import { CommonModule, DOCUMENT, PlatformLocation, ViewportScroller } from '@angular/common';
import { ApplicationModule, NgModule, RendererFactory2, StaticProvider } from '@angular/core';
import { MessageBus, ObjectStore, Serializer, SharedStylesHost } from '../shared';
import { ServerMessageBus } from './server-bus';
import { ServerPlatformLocation } from './server-location';
import { ServerRenderer2Factory } from './server-renderer';
import { ServerStylesHost } from './server-styles';
import { ServerViewportScroller } from './server-viewport-scroller';

export const PLATFORM_CLOUD_SERVER_TRANSIENT_PROVIDERS: StaticProvider[] = [
  { provide: ObjectStore, useClass: ObjectStore, deps: [] },
  { provide: Serializer, useClass: Serializer, deps: [ObjectStore] },
  { provide: ViewportScroller, useClass: ServerViewportScroller, deps: [] },
  { provide: PlatformLocation, useClass: ServerPlatformLocation, deps: [] },
  { provide: MessageBus, useClass: ServerMessageBus, deps: [] },
  { provide: RendererFactory2, useClass: ServerRenderer2Factory, deps: [SharedStylesHost, MessageBus, ObjectStore, Serializer] },
  { provide: SharedStylesHost, useClass: ServerStylesHost, deps: [DOCUMENT] }
];

@NgModule({
  exports: [
    ApplicationModule,
    CommonModule
  ],
  providers: PLATFORM_CLOUD_SERVER_TRANSIENT_PROVIDERS
})
export class CloudServerModule {}
