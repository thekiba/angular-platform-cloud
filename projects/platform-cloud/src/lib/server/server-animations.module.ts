import { AnimationBuilder } from '@angular/animations';
import {
  AnimationDriver,
  ɵAnimationEngine as AnimationEngine,
  ɵAnimationStyleNormalizer as AnimationStyleNormalizer,
  ɵNoopAnimationDriver as NoopAnimationDriver,
  ɵNoopAnimationStyleNormalizer as NoopAnimationStyleNormalizer
} from '@angular/animations/browser';
import { DOCUMENT } from '@angular/common';
import { NgModule, NgZone, Provider, RendererFactory2 } from '@angular/core';
import {
  ANIMATION_MODULE_TYPE,
  ɵAnimationRendererFactory as AnimationRendererFactory,
  ɵBrowserAnimationBuilder as BrowserAnimationBuilder
} from '@angular/platform-browser/animations';
import { AnimationEngineAdapter, MessageBus, ObjectStore, Serializer } from '../shared';
import { ServerAnimationEngine } from './server-animation-engine';
import { ServerAnimationEngineAdapter } from './server-animation-engine-adapter';
import { ServerRendererFactory2 } from './server-renderer';

const PLATFORM_CLOUD_SERVER_ANIMATIONS_PROVIDERS: Provider[] = [
  { provide: AnimationEngineAdapter, useClass: ServerAnimationEngineAdapter, deps: [MessageBus, Serializer, NgZone] },
  { provide: AnimationBuilder, useClass: BrowserAnimationBuilder },
  { provide: AnimationStyleNormalizer, useClass: NoopAnimationStyleNormalizer },
  {
    provide: AnimationEngine,
    useClass: ServerAnimationEngine,
    deps: [DOCUMENT, AnimationDriver, AnimationStyleNormalizer, AnimationEngineAdapter, ObjectStore]
  },
  {
    provide: RendererFactory2,
    useClass: AnimationRendererFactory,
    deps: [ServerRendererFactory2, AnimationEngine, NgZone]
  },
  { provide: AnimationDriver, useClass: NoopAnimationDriver },
  { provide: ANIMATION_MODULE_TYPE, useValue: 'ServerAnimations' }
];

@NgModule({
  providers: [
    PLATFORM_CLOUD_SERVER_ANIMATIONS_PROVIDERS
  ]
})
export class CloudServerAnimationsModule {}
