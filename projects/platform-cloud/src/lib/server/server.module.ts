import { AnimationBuilder } from '@angular/animations';
import {
  AnimationDriver,
  ɵAnimationEngine as AnimationEngine,
  ɵAnimationStyleNormalizer as AnimationStyleNormalizer,
  ɵNoopAnimationDriver as NoopAnimationDriver,
  ɵNoopAnimationStyleNormalizer as NoopAnimationStyleNormalizer
} from '@angular/animations/browser';
import { CommonModule, DOCUMENT, PlatformLocation, ViewportScroller } from '@angular/common';
import { ApplicationModule, NgModule, NgZone, Provider, RendererFactory2, StaticProvider } from '@angular/core';
import {
  ANIMATION_MODULE_TYPE,
  ɵAnimationRendererFactory as AnimationRendererFactory,
  ɵBrowserAnimationBuilder as BrowserAnimationBuilder
} from '@angular/platform-browser/animations';

import {
  AnimationEngineAdapter,
  LocationAdapter,
  MessageBus,
  ObjectStore,
  RendererAdapter2,
  Serializer,
  SharedStylesHost
} from '../shared';
import { ServerAnimationEngine } from './server-animation-engine';
import { ServerAnimationEngineAdapter } from './server-animation-engine-adapter';
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
  { provide: RendererAdapter2, useClass: ServerRendererAdapter2, deps: [MessageBus, Serializer, ServerGlobalEvents, NgZone] }
];

export function instantiateRendererFactory(
  renderer: ServerRendererFactory2, engine: AnimationEngine, zone: NgZone) {
  return new AnimationRendererFactory(renderer, engine, zone);
}

const PLATFORM_CLOUD_SERVER_ANIMATIONS_PROVIDERS: Provider[] = [
  { provide: AnimationEngineAdapter, useClass: ServerAnimationEngineAdapter, deps: [MessageBus, Serializer, NgZone] },
  { provide: AnimationBuilder, useClass: BrowserAnimationBuilder },
  { provide: AnimationStyleNormalizer, useClass: NoopAnimationStyleNormalizer },
  { provide: AnimationEngine, useClass: ServerAnimationEngine, deps: [DOCUMENT, AnimationDriver, AnimationStyleNormalizer, AnimationEngineAdapter, ObjectStore] }, {
    provide: RendererFactory2,
    useFactory: instantiateRendererFactory,
    deps: [ServerRendererFactory2, AnimationEngine, NgZone]
  },
  { provide: AnimationDriver, useClass: NoopAnimationDriver },
  { provide: ANIMATION_MODULE_TYPE, useValue: 'ServerAnimations' }
];

@NgModule({
  exports: [
    ApplicationModule,
    CommonModule
  ],
  providers: [
    PLATFORM_CLOUD_SERVER_TRANSIENT_PROVIDERS,
    PLATFORM_CLOUD_SERVER_ANIMATIONS_PROVIDERS
  ]
})
export class CloudServerModule {}
