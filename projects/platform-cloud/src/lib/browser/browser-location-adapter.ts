import { PlatformLocation } from '@angular/common';
import { Injectable, Injector } from '@angular/core';
import {
  command,
  FnArg,
  fnArg,
  LocationAdapter,
  LocationMethods,
  MessageBus,
  ObjectStore,
  PrimitiveArg,
  Serializer,
  SerializerTypes,
  StoreObjectArg
} from '../shared';

@Injectable()
export class BrowserLocationAdapter extends LocationAdapter {

  constructor(private bus: MessageBus, private serializer: Serializer,
              private store: ObjectStore, private platformLocation: PlatformLocation) {
    super();
  }

  back(): void {
    this.platformLocation.back();
  }

  forward(): void {
    this.platformLocation.forward();
  }

  getBaseHrefFromDOM(baseHrefArg: PrimitiveArg): void {
    this.callServerLocation('getBaseHrefFromDOM', ...arguments);
  }

  getLocation(locationArg: PrimitiveArg): void {
    this.callServerLocation('getLocation', ...arguments);
  }

  getState(stateArg: PrimitiveArg): void {
    this.callServerLocation('getState', ...arguments);
  }

  hashChange(handlerArg: StoreObjectArg, eventArg: PrimitiveArg): void {
    this.callServerLocation('hashChange', ...arguments);
  }

  onHashChange(handlerArg: StoreObjectArg): void {
    const handler = (event) =>
      this.hashChange(
        fnArg(handler, SerializerTypes.STORE_OBJECT),
        fnArg(event)
      );
    this.store.allocateNode(handler, handlerArg.value);
    this.platformLocation.onHashChange(handler);
  }

  onPopState(handlerArg: StoreObjectArg): void {
    const handler = (event) =>
      this.popState(
        fnArg(handler, SerializerTypes.STORE_OBJECT),
        fnArg(event)
      );
    this.store.allocateNode(handler, handlerArg.value);
    this.platformLocation.onPopState(handler);
  }

  popState(handlerArg: StoreObjectArg, eventArg: PrimitiveArg): void {
    this.callServerLocation('popState', ...arguments);
  }

  pushState(stateArg: PrimitiveArg, titleArg: PrimitiveArg, urlArg: PrimitiveArg): void {
    const [ state, title, url ] = this.deserialize(...arguments);
    this.platformLocation.pushState(state, title, url);
  }

  replaceState(stateArg: PrimitiveArg, titleArg: PrimitiveArg, urlArg: PrimitiveArg): void {
    const [ state, title, url ] = this.deserialize(...arguments);
    this.platformLocation.replaceState(state, title, url);
  }

  private callServerLocation(method: LocationMethods, ...fnArgs: FnArg[]): void {
    const payload = fnArgs.map(arg => this.serializer.serialize(arg.value, arg.type));
    this.bus.sendCommand(command('location', method, payload));
  }

  private deserialize(...fnArgs: FnArg[]): [ ...any[] ] {
    return fnArgs.map(arg => this.serializer.deserialize(arg.value, arg.type)) as [ ...any[] ];
  }
}
