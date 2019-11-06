import { CommonModule, DOCUMENT } from '@angular/common';
import { APP_ID, APP_INITIALIZER, ApplicationModule, NgModule, RendererFactory2, StaticProvider } from '@angular/core';
import {
  EventManager,
  ɵDomRendererFactory2 as DomRendererFactory2,
  ɵDomSharedStylesHost as DomSharedStylesHost
} from '@angular/platform-browser';
import { MessageBus, ObjectStore, RendererAdapter2, Serializer } from '../shared';
import { BrowserMain } from './browser-main';
import { BrowserMessageBus } from './browser-message-bus';
import { BrowserRendererAdapter2 } from './browser-renderer-adapter';

export const PLATFORM_CLOUD_SERVER_TRANSIENT_PROVIDERS: StaticProvider = [
  { provide: ObjectStore, useClass: ObjectStore, deps: [] },
  { provide: Serializer, useClass: Serializer, deps: [ObjectStore] },
  { provide: DomSharedStylesHost, useClass: DomSharedStylesHost, deps: [DOCUMENT] },
  { provide: RendererFactory2, useClass: DomRendererFactory2, deps: [EventManager, DomSharedStylesHost, APP_ID] },
  { provide: RendererAdapter2, useClass: BrowserRendererAdapter2, deps: [Serializer, ObjectStore, RendererFactory2, MessageBus] },
  { provide: MessageBus, useClass: BrowserMessageBus, deps: [DOCUMENT] },
  { provide: BrowserMain, useClass: BrowserMain, deps: [MessageBus, RendererAdapter2] },
  { provide: APP_INITIALIZER, useFactory: _boostrap, deps: [BrowserMain], multi: true }
];

@NgModule({
  exports: [
    ApplicationModule,
    CommonModule
  ],
  providers: PLATFORM_CLOUD_SERVER_TRANSIENT_PROVIDERS
})
export class CloudBrowserModule {}

function _boostrap(): () => Promise<true> {
  return () => Promise.resolve(true);
}
