import { DOCUMENT, PlatformLocation, ɵBrowserPlatformLocation as BrowserPlatformLocation } from '@angular/common';
import { APP_ID, APP_INITIALIZER, ApplicationModule, NgModule, RendererFactory2, StaticProvider, Optional } from '@angular/core';
import {
  EventManager,
  ɵDomRendererFactory2 as DomRendererFactory2,
  ɵDomSharedStylesHost as DomSharedStylesHost,
  // ɵDefaultRendererFactory2 as DefaultRendererFactory2
} from '@angular/platform-browser';
import { ɵAnimationRendererFactory as AnimationRendererFactory } from '@angular/platform-browser/animations';
import { AnimationEngineAdapter, LocationAdapter, MessageBus, ObjectStore, RendererAdapter2, Serializer } from '../shared';
import { BrowserAnimationEngineAdapter } from './browser-animation-engine-adapter';
import { BrowserLocationAdapter } from './browser-location-adapter';
import { BrowserMain } from './browser-main';
import { BrowserMessageBus } from './browser-message-bus';
import { BrowserRendererAdapter2 } from './browser-renderer-adapter';
import { ɵAnimationEngine as AnimationEngine } from '@angular/animations/browser';

export const PLATFORM_CLOUD_SERVER_TRANSIENT_PROVIDERS: StaticProvider = [
  { provide: ObjectStore, useClass: ObjectStore, deps: [] },
  { provide: Serializer, useClass: Serializer, deps: [ObjectStore] },
  { provide: PlatformLocation, useClass: BrowserPlatformLocation, deps: [DOCUMENT] },
  { provide: DomSharedStylesHost, useClass: DomSharedStylesHost, deps: [DOCUMENT] },
  { provide: LocationAdapter, useClass: BrowserLocationAdapter, deps: [MessageBus, Serializer, ObjectStore, PlatformLocation] },
  { provide: RendererFactory2, useClass: DomRendererFactory2, deps: [EventManager, DomSharedStylesHost, APP_ID] },
  { provide: RendererAdapter2, useClass: BrowserRendererAdapter2, deps: [Serializer, ObjectStore, RendererFactory2, MessageBus] },
  { provide: MessageBus, useClass: BrowserMessageBus, deps: [DOCUMENT] },
  { provide: BrowserMain, useClass: BrowserMain, deps: [MessageBus, RendererAdapter2, LocationAdapter, PlatformLocation, AnimationEngineAdapter] },
  { provide: APP_INITIALIZER, useFactory: _boostrap, deps: [BrowserMain], multi: true },
  { provide: AnimationEngineAdapter, useClass: BrowserAnimationEngineAdapter, deps: [[ new Optional(), AnimationEngine ], Serializer, ObjectStore, MessageBus, RendererFactory2] }
];

@NgModule({
  exports: [ ApplicationModule ],
  providers: PLATFORM_CLOUD_SERVER_TRANSIENT_PROVIDERS
})
export class CloudBrowserModule {}

export function _boostrap(main: BrowserMain) {
  return () => {
    main.bootstrap();
    return Promise.resolve(true);
  };
}
