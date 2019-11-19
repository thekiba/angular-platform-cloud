import { Injectable } from '@angular/core';
import { command, FnArg, LocationAdapter, LocationMethods, MessageBus, PrimitiveArg, Serializer, StoreObjectArg } from '../shared';
import { ServerLocationState } from './server-location-state';

@Injectable()
export class ServerLocationAdapter extends LocationAdapter {
  constructor(private bus: MessageBus, private state: ServerLocationState, private serializer: Serializer) {
    super();
  }

  back(): void {
    this.callBrowserLocation('back', ...arguments);
  }

  forward(): void {
    this.callBrowserLocation('forward', ...arguments);
  }

  getBaseHrefFromDOM(baseHrefArg: PrimitiveArg): void {
    const [ baseHref ] = this.deserialize(...arguments);
    this.state.baseHref = baseHref;
  }

  getState(stateArg: PrimitiveArg): void {
    const [ state ] = this.deserialize(...arguments);
    this.state.state = state;
  }

  getLocation(locationArg: PrimitiveArg): void {
    const [ location ] = this.deserialize(...arguments);
    this.state.location = location;
  }

  onHashChange(handlerArg: StoreObjectArg): void {
    this.callBrowserLocation('onHashChange', ...arguments);
  }

  hashChange(handlerArg: StoreObjectArg, eventArg: PrimitiveArg): void {
    const [fn, event] = this.deserialize(...arguments);
    if (typeof fn === 'function') {
      fn(event);
    }
  }

  onPopState(handlerArg: StoreObjectArg): void {
    this.callBrowserLocation('onPopState', ...arguments);
  }

  popState(handlerArg: StoreObjectArg, eventArg: PrimitiveArg): void {
    const [fn, event] = this.deserialize(...arguments);
    if (typeof fn === 'function') {
      fn(event);
    }
  }

  pushState(stateArg: PrimitiveArg, titleArg: PrimitiveArg, urlArg: PrimitiveArg): void {
    this.callBrowserLocation('pushState', ...arguments);
  }

  replaceState(stateArg: PrimitiveArg, titleArg: PrimitiveArg, urlArg: PrimitiveArg): void {
    this.callBrowserLocation('replaceState', ...arguments);
  }

  private callBrowserLocation(method: LocationMethods, ...fnArgs: FnArg[]): void {
    const payload = fnArgs.map(arg => this.serializer.serialize(arg.value, arg.type));
    this.bus.sendCommand(command('location', method, payload));
  }

  private deserialize(...fnArgs: FnArg[]): [ ...any[] ] {
    return fnArgs.map(arg => this.serializer.deserialize(arg.value, arg.type));
  }
}
