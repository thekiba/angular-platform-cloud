import { LocationChangeListener, PlatformLocation } from '@angular/common';
import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommandType, fnArg, LocationAdapter, LocationCommand, MessageBus, ObjectStore, SerializerTypes } from '../shared';
import { ServerLocationState } from './server-location-state';

@Injectable()
export class ServerPlatformLocation extends PlatformLocation implements OnDestroy {
  get hash(): string { return this.state.hash; }
  get hostname(): string { return this.state.hostname; }
  get href(): string { return this.state.href; }
  get pathname(): string { return this.state.pathname; }
  get port(): string { return this.state.port; }
  get protocol(): string { return this.state.protocol; }
  get search(): string { return this.state.search; }

  private subscription: Subscription;

  constructor(private adapter: LocationAdapter, private bus: MessageBus,
              private state: ServerLocationState, private store: ObjectStore) {
    super();

    this.subscription = this.bus.getCommands().subscribe(
      (command: CommandType) => {
        if (command.target === 'location') {
          this.handleLocationCommand(command);
        }
      }
    );
  }

  back(): void {
    this.adapter.back();
  }

  forward(): void {
    this.adapter.forward();
  }

  getBaseHrefFromDOM(): string {
    return this.state.baseHref;
  }

  getState(): unknown {
    return this.state.state;
  }

  onHashChange(fn: LocationChangeListener): void {
    this.store.allocateNode(fn);
    this.adapter.onHashChange(
      fnArg(fn, SerializerTypes.STORE_OBJECT)
    );
  }

  onPopState(fn: LocationChangeListener): void {
    this.store.allocateNode(fn);
    this.adapter.onPopState(
      fnArg(fn, SerializerTypes.STORE_OBJECT)
    );
  }

  pushState(state: any, title: string, url: string): void {
    this.adapter.pushState(
      fnArg(state),
      fnArg(title),
      fnArg(url)
    );
  }

  replaceState(state: any, title: string, url: string): void {
    this.adapter.replaceState(
      fnArg(state),
      fnArg(title),
      fnArg(url)
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  private handleLocationCommand(command: LocationCommand): void {
    switch (command.method) {
      case 'getBaseHrefFromDOM':
        this.adapter.getBaseHrefFromDOM(
          fnArg(command.fnArgs[ 0 ])
        );
        break;

      case 'getState':
        this.adapter.getState(
          fnArg(command.fnArgs[ 0 ])
        );
        break;

      case 'getLocation':
        this.adapter.getLocation(
          fnArg(command.fnArgs[ 0 ])
        );
        break;

      case 'hashChange':
        this.adapter.hashChange(
          fnArg(command.fnArgs[ 0 ], SerializerTypes.STORE_OBJECT),
          fnArg(command.fnArgs[ 1 ])
        );
        break;

      case 'popState':
        this.adapter.popState(
          fnArg(command.fnArgs[ 0 ], SerializerTypes.STORE_OBJECT),
          fnArg(command.fnArgs[ 1 ])
        );
        break;
    }
  }
}
