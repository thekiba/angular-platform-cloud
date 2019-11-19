import { Inject, Injectable, InjectionToken } from '@angular/core';
import { LocationState } from '../shared';

export const DEFAULT_LOCATION_STATE = new InjectionToken('Default Location State');

@Injectable()
export class ServerLocationState {
  get hash(): string { return this.location.hash; }
  get hostname(): string { return this.location.hostname; }
  get href(): string { return this.location.href; }
  get pathname(): string { return this.location.pathname; }
  get port(): string { return this.location.port; }
  get protocol(): string { return this.location.protocol; }
  get search(): string { return this.location.search; }

  location: LocationState;
  baseHref: string;
  state: any;

  constructor(@Inject(DEFAULT_LOCATION_STATE) defaultLocationState) {
    this.location = defaultLocationState.location;
    this.baseHref = defaultLocationState.baseHref;
    this.state = defaultLocationState.state;
  }

}
