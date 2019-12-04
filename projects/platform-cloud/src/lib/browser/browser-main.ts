import { PlatformLocation } from '@angular/common';
import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  AnimationEngineAdapter,
  AnimationEngineCommand,
  CommandType,
  fnArg,
  LocationAdapter,
  LocationCommand,
  LocationState,
  MessageBus,
  RendererAdapter2, RendererCommand,
  SerializerTypes
} from '../shared';

@Injectable()
export class BrowserMain implements OnDestroy {

  private subscription: Subscription;

  constructor(private bus: MessageBus, private rendererAdapter: RendererAdapter2,
              private locationAdapter: LocationAdapter, private platformLocation: PlatformLocation,
              private animationEngineAdapter: AnimationEngineAdapter) {
  }

  bootstrap(): void {
    // Todo: cleanup below

    this.subscription = this.bus.getCommands().subscribe(
      (command) => this.processCommand(command));

    this.locationAdapter.getBaseHrefFromDOM(
      fnArg(this.platformLocation.getBaseHrefFromDOM())
    );

    this.locationAdapter.getState(
      fnArg(this.platformLocation.getState())
    );

    this.locationAdapter.getLocation(
      fnArg({
        hash: this.platformLocation.hash,
        hostname: this.platformLocation.hostname,
        href: this.platformLocation.href,
        pathname: this.platformLocation.pathname,
        port: this.platformLocation.port,
        protocol: this.platformLocation.protocol,
        search: this.platformLocation.search,
      } as LocationState)
    );
  }

  processCommand(command: CommandType): void {
    if (command.target === 'renderer') {
      this.processRendererCommand(command);
    }

    if (command.target === 'location') {
      this.processLocationCommand(command);
    }

    if (command.target === 'animation-engine') {
      this.processAnimationEngineCommand(command);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  private processRendererCommand(command: RendererCommand) {
    const next = toIterator(command.fnArgs);
    switch (command.method) {
      case 'begin':
        this.rendererAdapter.begin();
        break;
      case 'end':
        this.rendererAdapter.end();
        break;
      case 'createRenderer':
        this.rendererAdapter.createRenderer(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.RENDERER_TYPE_2),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'destroyNode':
        this.rendererAdapter.destroyNode(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'addClass':
        this.rendererAdapter.addClass(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next())
        );
        break;
      case 'appendChild':
        this.rendererAdapter.appendChild(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'event':
        break;
      case 'createComment':
        this.rendererAdapter.createComment(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'createElement':
        this.rendererAdapter.createElement(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next()),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'createText':
        this.rendererAdapter.createText(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'destroy':
        this.rendererAdapter.destroy(
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'insertBefore':
        this.rendererAdapter.insertBefore(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'listen':
        this.rendererAdapter.listen(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next()),
          fnArg(next())
        );
        break;
      case 'unlisten':
        this.rendererAdapter.unlisten(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next())
        );
        break;
      case 'nextSibling':
        this.rendererAdapter.nextSibling(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'parentNode':
        this.rendererAdapter.parentNode(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'removeAttribute':
        this.rendererAdapter.removeAttribute(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next())
        );
        break;
      case 'removeChild':
        this.rendererAdapter.removeChild(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next())
        );
        break;
      case 'removeClass':
        this.rendererAdapter.removeClass(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next())
        );
        break;
      case 'removeStyle':
        this.rendererAdapter.removeStyle(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next())
        );
        break;
      case 'selectRootElement':
        this.rendererAdapter.selectRootElement(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next()),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'setAttribute':
        this.rendererAdapter.setAttribute(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next()),
          fnArg(next())
        );
        break;
      case 'setProperty':
        this.rendererAdapter.setProperty(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next())
        );
        break;
      case 'setStyle':
        this.rendererAdapter.setStyle(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next()),
          fnArg(next())
        );
        break;
      case 'setValue':
        this.rendererAdapter.setValue(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next())
        );
        break;
      default:
        throw new Error(`Unknown renderer method ${ command.method }`);
    }
  }

  private processLocationCommand(command: LocationCommand) {
    const next = toIterator(command.fnArgs);
    switch (command.method) {
      case 'back':
        this.locationAdapter.back();
        break;
      case 'forward':
        this.locationAdapter.forward();
        break;
      case 'getBaseHrefFromDOM':
        break;
      case 'getState':
        break;
      case 'getLocation':
        break;
      case 'onHashChange':
        this.locationAdapter.onHashChange(
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'hashChange':
        break;
      case 'onPopState':
        this.locationAdapter.onPopState(
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'popState':
        break;
      case 'pushState':
        this.locationAdapter.pushState(
          fnArg(next()),
          fnArg(next()),
          fnArg(next())
        );
        break;
      case 'replaceState':
        this.locationAdapter.replaceState(
          fnArg(next()),
          fnArg(next()),
          fnArg(next())
        );
        break;
      default:
        throw new Error(`Unknown location method ${ command.method }`);
    }
  }

  private processAnimationEngineCommand(command: AnimationEngineCommand) {
    const next = toIterator(command.fnArgs);
    switch (command.method) {
      case 'destroy':
        this.animationEngineAdapter.destroy(
          fnArg(next()),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'disableAnimations':
        this.animationEngineAdapter.disableAnimations(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next())
        );
        break;
      case 'flush':
        this.animationEngineAdapter.flush(
          fnArg(next())
        );
        break;
      case 'event':
        this.animationEngineAdapter.event(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next(), SerializerTypes.DOM_EVENT)
        );
        break;
      case 'listen':
        this.animationEngineAdapter.listen(
          fnArg(next()),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next()),
          fnArg(next())
        );
        break;
      case 'unlisten':
        this.animationEngineAdapter.unlisten(
          fnArg(next())
        );
        break;
      case 'onInsert':
        this.animationEngineAdapter.onInsert(
          fnArg(next()),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next())
        );
        break;
      case 'onRemove':
        this.animationEngineAdapter.onRemove(
          fnArg(next()),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next())
        );
        break;
      case 'onRemovalComplete':
        this.animationEngineAdapter.onRemovalComplete(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'process':
        this.animationEngineAdapter.process(
          fnArg(next()),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next())
        );
        break;
      case 'register':
        this.animationEngineAdapter.register(
          fnArg(next()),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'registerTrigger':
        this.animationEngineAdapter.registerTrigger(
          fnArg(next()),
          fnArg(next()),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next())
        );
        break;

      default:
        throw new Error(`Unknown animation engine method ${ command.method }`);
    }
  }
}

function toIterator(values: any[]): () => any {
  function *_() {
    for (const value of values) {
      yield value;
    }
  }
  const iterator = _();
  return () => iterator.next().value;
}
