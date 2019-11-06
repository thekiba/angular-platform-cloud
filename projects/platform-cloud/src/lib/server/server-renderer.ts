import { Injectable, OnDestroy, Renderer2, RendererFactory2, RendererStyleFlags2, RendererType2 } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  AllocatedNode,
  EventEmitter,
  EventMessage,
  FnArg,
  fnArg,
  RenderMethods,
  Serializer,
  SerializerTypes,
  SharedStylesHost
} from '../shared';
import { MessageBus } from '../shared/message-bus';
import { ObjectStore } from '../shared/object-store';

@Injectable()
export class ServerRenderer2Factory implements RendererFactory2, OnDestroy {

  globalEvents = new EventEmitter();

  private subscription: Subscription;

  constructor(private sharedStylesHost: SharedStylesHost,
              private bus: MessageBus, private store: ObjectStore,
              private serializer: Serializer
  ) {
    this.subscription = this.bus.getEvents().subscribe(
      ({ target, eventName, event }: EventMessage) =>
        this.dispatchEvent(target, eventName, event));
  }

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
    const renderer = new ServerRenderer2(this);
    this.allocateNode(renderer);

    this.callBrowserRenderer('createRenderer', [
      fnArg(hostElement, SerializerTypes.STORE_OBJECT),
      fnArg(type, SerializerTypes.RENDERER_TYPE_2),
      fnArg(renderer, SerializerTypes.STORE_OBJECT)
    ]);

    return renderer;
  }

  allocateId(): number {
    return this.store.allocateId();
  }

  allocateNode(node?: AllocatedNode | any): AllocatedNode {
    return this.store.allocateNode(node);
  }

  callBrowserRenderer(method: RenderMethods, fnArgs: FnArg[] = []): void {
    const payload = fnArgs.map(arg => this.serializer.serialize(arg.value, arg.type));
    this.bus.invoke(method, payload);
  }

  deallocateNode(node: AllocatedNode) {
    this.store.deallocateNode(node);
  }

  dispatchEvent(target: 'window' | 'document' | 'body' | number | any, eventName: string, event: any): void {
    const targetEl: AllocatedNode = typeof target === 'number'
      ? this.store.deserialize(target)
      : null;

    const targetName = typeof target === 'string'
      ? target
      : null;

    const globalEvent: string = typeof target === 'string'
      ? `${ targetName }:${ eventName }`
      : null;

    targetName
      ? this.globalEvents.emit(globalEvent, event)
      : targetEl.events.emit(eventName, event);
  }

  globalListen(eventName: string, listener: Function): Function {
    return this.globalEvents.listen(eventName, listener);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}

@Injectable()
export class ServerRenderer2 implements Renderer2 {

  constructor(private factory: ServerRenderer2Factory) {}

  readonly data: { [ p: string ]: any };

  destroyNode(node: any): void {
    this.callBrowserRenderer('destroyNode', [
      fnArg(node, SerializerTypes.STORE_OBJECT)
    ]);
    this.deallocateNode(node);
  }

  addClass(el: any, name: string): void {
    this.callBrowserRenderer('addClass', [
      fnArg(el, SerializerTypes.STORE_OBJECT),
      fnArg(name)
    ]);
  }

  appendChild(parent: any, newChild: any): void {
    this.callBrowserRenderer('appendChild', [
      fnArg(parent, SerializerTypes.STORE_OBJECT),
      fnArg(newChild, SerializerTypes.STORE_OBJECT)
    ]);
  }

  createComment(value: string): any {
    const commentElement = this.allocateNode();
    this.callBrowserRenderer('createComment', [
      fnArg(value),
      fnArg(commentElement, SerializerTypes.STORE_OBJECT)
    ]);
    return commentElement;
  }

  createElement(name: string, namespace?: string | null): any {
    const element = this.allocateNode();
    this.callBrowserRenderer('createElement', [
      fnArg(name),
      fnArg(namespace),
      fnArg(element, SerializerTypes.STORE_OBJECT)
    ]);
    return element;
  }

  createText(value: string): any {
    const textElement = this.allocateNode();
    this.callBrowserRenderer('createText', [
      fnArg(value),
      fnArg(textElement, SerializerTypes.STORE_OBJECT)
    ]);
    return textElement;
  }

  destroy(): void {
    this.callBrowserRenderer('destroy');
  }

  insertBefore(parent: any, newChild: any, refChild: any): void {
    this.callBrowserRenderer('insertBefore', [
      fnArg(parent, SerializerTypes.STORE_OBJECT),
      fnArg(newChild, SerializerTypes.STORE_OBJECT),
      fnArg(refChild, SerializerTypes.STORE_OBJECT)
    ]);
  }

  listen(target: 'window' | 'document' | 'body' | any, eventName: string, callback: (event: any) => (boolean | void)): () => void {
    const listenId = this.allocateId();

    const targetEl: AllocatedNode = typeof target === 'string'
      ? null
      : target;

    const targetName: string = typeof target === 'string'
      ? target
      : null;

    const globalEvent: string = typeof target === 'string'
      ? `${ targetName }:${ eventName }`
      : null;

    const unlisten: Function = targetName
      ? this.globalListen(globalEvent, callback)
      : targetEl.events.listen(eventName, callback);

    this.callBrowserRenderer('listen', [
      fnArg(targetEl, SerializerTypes.STORE_OBJECT),
      fnArg(targetName),
      fnArg(eventName),
      fnArg(listenId)
    ]);

    return () => {
      this.callBrowserRenderer('unlisten', [
        fnArg(listenId)
      ]);
      unlisten();
    };
  }

  nextSibling(node: any): any {
    const element = this.allocateNode();
    this.callBrowserRenderer('nextSibling', [
      fnArg(node, SerializerTypes.STORE_OBJECT),
      fnArg(element, SerializerTypes.STORE_OBJECT)
    ]);
    return element;
  }

  parentNode(node: any): any {
    const element = this.allocateNode();
    this.callBrowserRenderer('parentNode', [
      fnArg(node, SerializerTypes.STORE_OBJECT),
      fnArg(element, SerializerTypes.STORE_OBJECT)
    ]);
    return element;
  }

  removeAttribute(el: any, name: string, namespace?: string | null): void {
    this.callBrowserRenderer('removeAttribute', [
      fnArg(el, SerializerTypes.STORE_OBJECT),
      fnArg(name),
      fnArg(namespace)
    ]);
  }

  removeChild(parent: any, oldChild: any, isHostElement?: boolean): void {
    this.callBrowserRenderer('removeChild', [
      fnArg(parent, SerializerTypes.STORE_OBJECT),
      fnArg(oldChild, SerializerTypes.STORE_OBJECT),
      fnArg(isHostElement)
    ]);
  }

  removeClass(el: any, name: string): void {
    this.callBrowserRenderer('removeClass', [
      fnArg(el, SerializerTypes.STORE_OBJECT),
      fnArg(name)
    ]);
  }

  removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void {
    this.callBrowserRenderer('removeStyle', [
      fnArg(el, SerializerTypes.STORE_OBJECT),
      fnArg(style),
      fnArg(flags)
    ]);
  }

  selectRootElement(selectorOrNode: string | any, preserveContent?: boolean): any {
    const rootElement = this.allocateNode();
    this.callBrowserRenderer('selectRootElement', [
      fnArg(selectorOrNode),
      fnArg(preserveContent)
    ]);
    return rootElement;
  }

  setAttribute(el: any, name: string, value: string, namespace?: string | null): void {
    this.callBrowserRenderer('setAttribute', [
      fnArg(el, SerializerTypes.STORE_OBJECT),
      fnArg(name),
      fnArg(value),
      fnArg(namespace)
    ]);
  }

  setProperty(el: any, name: string, value: any): void {
    this.callBrowserRenderer('setProperty', [
      fnArg(el, SerializerTypes.STORE_OBJECT),
      fnArg(name),
      fnArg(value)
    ]);
  }

  setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2): void {
    this.callBrowserRenderer('setStyle', [
      fnArg(el, SerializerTypes.STORE_OBJECT),
      fnArg(style),
      fnArg(value),
      fnArg(flags)
    ]);
  }

  setValue(node: any, value: string): void {
    this.callBrowserRenderer('setValue', [
      fnArg(node, SerializerTypes.STORE_OBJECT),
      fnArg(value)
    ]);
  }

  private allocateId(): number {
    return this.factory.allocateId();
  }

  private allocateNode(): AllocatedNode {
    return this.factory.allocateNode();
  }

  private deallocateNode(node: AllocatedNode): void {
    return this.factory.deallocateNode(node);
  }

  private globalListen(eventName: string, listener: Function): Function {
    return this.factory.globalListen(eventName, listener);
  }

  private callBrowserRenderer(method: RenderMethods, fnArgs: FnArg[] = []): void {
    this.factory.callBrowserRenderer(method, fnArgs);
  }
}
