import { PrimitiveArg, StoreObjectArg } from './api';

export type LocationMethods = keyof LocationAdapter;

export interface LocationState {
  hash: string;
  hostname: string;
  href: string;
  pathname: string;
  port: string;
  protocol: string;
  search: string;
}

export abstract class LocationAdapter {
  abstract back(): void;
  abstract forward(): void;
  abstract getBaseHrefFromDOM(baseHrefArg: PrimitiveArg): void;
  abstract getState(stateArg: PrimitiveArg): void;
  abstract getLocation(locationArg: PrimitiveArg): void;
  abstract onHashChange(handlerArg: StoreObjectArg): void;
  abstract hashChange(handlerArg: StoreObjectArg, eventArg: PrimitiveArg): void;
  abstract onPopState(handlerArg: StoreObjectArg): void;
  abstract popState(handlerArg: StoreObjectArg, eventArg: PrimitiveArg): void;
  abstract pushState(stateArg: PrimitiveArg, titleArg: PrimitiveArg, urlArg: PrimitiveArg): void;
  abstract replaceState(stateArg: PrimitiveArg, titleArg: PrimitiveArg, urlArg: PrimitiveArg): void;
}
