import { Injectable, NgZone, Renderer2 } from '@angular/core';
import {
  command, DomEventArg,
  FnArg,
  MessageBus,
  PrimitiveArg,
  RendererAdapter2,
  RendererMethods2,
  RendererType2Arg,
  Serializer,
  StoreObjectArg
} from '../shared';
import { ServerGlobalEvents } from './server-global-events';

@Injectable()
export class ServerRendererAdapter2 extends RendererAdapter2 {

  constructor(private bus: MessageBus, private serializer: Serializer, private globalEvents: ServerGlobalEvents,
              private ngZone: NgZone) {
    super();
  }

  addClass(rendererArg: StoreObjectArg, elArg: StoreObjectArg, nameArg: PrimitiveArg): void {
    this.callBrowserRenderer('addClass', ...arguments);
  }

  appendChild(rendererArg: StoreObjectArg, parentArg: StoreObjectArg, newChildArg: StoreObjectArg): void {
    this.callBrowserRenderer('appendChild', ...arguments);
  }

  event(rendererArg: StoreObjectArg, targetElArg: StoreObjectArg, targetNameArg: PrimitiveArg, eventNameArg: PrimitiveArg, eventArg: DomEventArg): void {
    const [ renderer, targetEl, targetName, eventName, event ] = this.deserialize(...arguments);

    const globalEvent: string = typeof targetName === 'string'
      ? `${ targetName }:${ eventName }`
      : null;

    this.ngZone.run(() => {
      const clickEvent = { isTrusted: true, type: 'click', target: targetEl, ...event };
      targetName
        ? this.globalEvents.emit(globalEvent, clickEvent)
        : targetEl.events.emit(eventName, clickEvent);
    });
  }

  createComment(rendererArg: StoreObjectArg, valueArg: PrimitiveArg, commentElementArg: StoreObjectArg): void {
    this.callBrowserRenderer('createComment', ...arguments);
  }

  createElement(rendererArg: StoreObjectArg, nameArg: PrimitiveArg, namespaceArg: PrimitiveArg, elementArg: StoreObjectArg): void {
    this.callBrowserRenderer('createElement', ...arguments);
  }

  createRenderer(hostElementArg: StoreObjectArg, typeArg: RendererType2Arg, rendererArg: StoreObjectArg): void {
    this.callBrowserRenderer('createRenderer', ...arguments);
  }

  createText(rendererArg: StoreObjectArg, valueArg: PrimitiveArg, textElementArg: StoreObjectArg): void {
    this.callBrowserRenderer('createText', ...arguments);
  }

  destroy(rendererArg: StoreObjectArg): void {
    this.callBrowserRenderer('destroy', ...arguments);
  }

  destroyNode(rendererArg: StoreObjectArg, nodeArg: StoreObjectArg): void {
    this.callBrowserRenderer('destroyNode', ...arguments);
  }

  insertBefore(rendererArg: StoreObjectArg, parentArg: StoreObjectArg, newChildArg: StoreObjectArg, refChildArg: StoreObjectArg): void {
    this.callBrowserRenderer('insertBefore', ...arguments);
  }

  listen(
    rendererArg: StoreObjectArg, targetElArg: StoreObjectArg, targetNameArg: PrimitiveArg, eventNameArg: PrimitiveArg, listenIdArg: PrimitiveArg): void {
    this.callBrowserRenderer('listen', ...arguments);
  }

  nextSibling(rendererArg: StoreObjectArg, nodeArg: StoreObjectArg, elementArg: StoreObjectArg): void {
    this.callBrowserRenderer('nextSibling', ...arguments);
  }

  parentNode(rendererArg: StoreObjectArg, nodeArg: StoreObjectArg, elementArg: StoreObjectArg): void {
    this.callBrowserRenderer('parentNode', ...arguments);
  }

  removeAttribute(rendererArg: StoreObjectArg, elArg: StoreObjectArg, nameArg: PrimitiveArg, namespaceArg: PrimitiveArg): void {
    this.callBrowserRenderer('removeAttribute', ...arguments);
  }

  removeChild(rendererArg: StoreObjectArg, parentArg: StoreObjectArg, oldChildArg: StoreObjectArg, isHostElementArg: PrimitiveArg): void {
    this.callBrowserRenderer('removeChild', ...arguments);
  }

  removeClass(rendererArg: StoreObjectArg, elArg: StoreObjectArg, nameArg: PrimitiveArg): void {
    this.callBrowserRenderer('removeClass', ...arguments);
  }

  removeStyle(rendererArg: StoreObjectArg, elArg: StoreObjectArg, styleArg: PrimitiveArg, flagsArg: PrimitiveArg): void {
    this.callBrowserRenderer('removeStyle', ...arguments);
  }

  selectRootElement(
    rendererArg: StoreObjectArg, selectorOrNodeArg: PrimitiveArg, preserveContentArg: PrimitiveArg, rootElementArg: StoreObjectArg): void {
    this.callBrowserRenderer('selectRootElement', ...arguments);
  }

  setAttribute(rendererArg: StoreObjectArg, elArg: StoreObjectArg, nameArg: PrimitiveArg, valueArg: PrimitiveArg, namespaceArg: PrimitiveArg): void {
    this.callBrowserRenderer('setAttribute', ...arguments);
  }

  setProperty(rendererArg: StoreObjectArg, elArg: StoreObjectArg, nameArg: PrimitiveArg, valueArg: PrimitiveArg): void {
    this.callBrowserRenderer('setProperty', ...arguments);
  }

  setStyle(rendererArg: StoreObjectArg, elArg: StoreObjectArg, styleArg: PrimitiveArg, valueArg: PrimitiveArg, flagsArg: PrimitiveArg): void {
    this.callBrowserRenderer('setStyle', ...arguments);
  }

  setValue(rendererArg: StoreObjectArg, nodeArg: StoreObjectArg, valueArg: PrimitiveArg): void {
    this.callBrowserRenderer('setValue', ...arguments);
  }

  unlisten(rendererArg: StoreObjectArg, listenIdArg: PrimitiveArg): void {
    this.callBrowserRenderer('unlisten', ...arguments);
  }

  private callBrowserRenderer(method: RendererMethods2, ...fnArgs: FnArg[]): void {
    const payload = fnArgs.map(arg => this.serializer.serialize(arg.value, arg.type));
    this.bus.sendCommand(command('renderer', method, payload));
  }

  private deserialize(...fnArgs: FnArg[]): [ Renderer2, ...any[] ] {
    return fnArgs.map(arg => this.serializer.deserialize(arg.value, arg.type)) as [ Renderer2, ...any[] ];
  }

}
