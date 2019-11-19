import { Injectable, OnDestroy, Renderer2, RendererFactory2, RendererStyleFlags2, RendererType2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { AllocatedNode, CommandType, fnArg, MessageBus, ObjectStore, RendererAdapter2, SerializerTypes, SharedStylesHost } from '../shared';
import { ServerGlobalEvents } from './server-global-events';

@Injectable()
export class ServerRendererFactory2 implements RendererFactory2, OnDestroy {

  private subscription: Subscription;

  constructor(private sharedStylesHost: SharedStylesHost,
              private bus: MessageBus, private store: ObjectStore,
              private rendererAdapter: RendererAdapter2,
              private globalEvents: ServerGlobalEvents
  ) {
    this.subscription = this.bus.getCommands().subscribe(
      (command: CommandType) => {
        if (command.target === 'renderer' && command.method === 'event') {
          this.rendererAdapter.event(
            fnArg(command.fnArgs[0], SerializerTypes.STORE_OBJECT),
            fnArg(command.fnArgs[1], SerializerTypes.STORE_OBJECT),
            fnArg(command.fnArgs[2]),
            fnArg(command.fnArgs[3]),
            fnArg(command.fnArgs[4], SerializerTypes.DOM_EVENT)
          );
        }
      });
  }

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
    const renderer = new ServerRenderer2(this, this.rendererAdapter);
    this.allocateNode(renderer);

    this.rendererAdapter.createRenderer(
      fnArg(hostElement, SerializerTypes.STORE_OBJECT),
      fnArg(type, SerializerTypes.RENDERER_TYPE_2),
      fnArg(renderer, SerializerTypes.STORE_OBJECT)
    );

    return renderer;
  }

  allocateId(): number {
    return this.store.allocateId();
  }

  allocateNode(node?: AllocatedNode | any): AllocatedNode {
    return this.store.allocateNode(node);
  }

  deallocateNode(node: AllocatedNode) {
    this.store.deallocateNode(node);
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

  constructor(private factory: ServerRendererFactory2, private rendererAdapter: RendererAdapter2) {}

  readonly data: { [ p: string ]: any };

  destroyNode(node: any): void {
    this.rendererAdapter.destroyNode(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(node, SerializerTypes.STORE_OBJECT)
    );
    this.deallocateNode(node);
  }

  addClass(el: any, name: string): void {
    this.rendererAdapter.addClass(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(el, SerializerTypes.STORE_OBJECT),
      fnArg(name)
    );
  }

  appendChild(parent: any, newChild: any): void {
    this.rendererAdapter.appendChild(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(parent, SerializerTypes.STORE_OBJECT),
      fnArg(newChild, SerializerTypes.STORE_OBJECT)
    );
  }

  createComment(value: string): any {
    const commentElement = this.allocateNode();
    this.rendererAdapter.createComment(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(value),
      fnArg(commentElement, SerializerTypes.STORE_OBJECT)
    );
    return commentElement;
  }

  createElement(name: string, namespace?: string | null): any {
    const element = this.allocateNode();
    this.rendererAdapter.createElement(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(name),
      fnArg(namespace),
      fnArg(element, SerializerTypes.STORE_OBJECT)
    );
    return element;
  }

  createText(value: string): any {
    const textElement = this.allocateNode();
    this.rendererAdapter.createText(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(value),
      fnArg(textElement, SerializerTypes.STORE_OBJECT)
    );
    return textElement;
  }

  destroy(): void {
    this.rendererAdapter.destroy(
      fnArg(this, SerializerTypes.STORE_OBJECT)
    );
  }

  insertBefore(parent: any, newChild: any, refChild: any): void {
    this.rendererAdapter.insertBefore(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(parent, SerializerTypes.STORE_OBJECT),
      fnArg(newChild, SerializerTypes.STORE_OBJECT),
      fnArg(refChild, SerializerTypes.STORE_OBJECT)
    );
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

    this.rendererAdapter.listen(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(targetEl, SerializerTypes.STORE_OBJECT),
      fnArg(targetName),
      fnArg(eventName),
      fnArg(listenId)
    );

    return () => {
      this.rendererAdapter.unlisten(
        fnArg(this, SerializerTypes.STORE_OBJECT),
        fnArg(listenId)
      );
      unlisten();
    };
  }

  nextSibling(node: any): any {
    const element = this.allocateNode();
    this.rendererAdapter.nextSibling(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(node, SerializerTypes.STORE_OBJECT),
      fnArg(element, SerializerTypes.STORE_OBJECT)
    );
    return element;
  }

  parentNode(node: any): any {
    const element = this.allocateNode();
    this.rendererAdapter.parentNode(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(node, SerializerTypes.STORE_OBJECT),
      fnArg(element, SerializerTypes.STORE_OBJECT)
    );
    return element;
  }

  removeAttribute(el: any, name: string, namespace?: string | null): void {
    this.rendererAdapter.removeAttribute(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(el, SerializerTypes.STORE_OBJECT),
      fnArg(name),
      fnArg(namespace)
    );
  }

  removeChild(parent: any, oldChild: any, isHostElement?: boolean): void {
    this.rendererAdapter.removeChild(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(parent, SerializerTypes.STORE_OBJECT),
      fnArg(oldChild, SerializerTypes.STORE_OBJECT),
      fnArg(isHostElement)
    );
  }

  removeClass(el: any, name: string): void {
    this.rendererAdapter.removeClass(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(el, SerializerTypes.STORE_OBJECT),
      fnArg(name)
    );
  }

  removeStyle(el: any, style: string, flags?: RendererStyleFlags2): void {
    this.rendererAdapter.removeStyle(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(el, SerializerTypes.STORE_OBJECT),
      fnArg(style),
      fnArg(flags)
    );
  }

  selectRootElement(selectorOrNode: string | any, preserveContent?: boolean): any {
    const rootElement = this.allocateNode();
    this.rendererAdapter.selectRootElement(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(selectorOrNode),
      fnArg(preserveContent),
      fnArg(rootElement, SerializerTypes.STORE_OBJECT)
    );
    return rootElement;
  }

  setAttribute(el: any, name: string, value: string, namespace?: string | null): void {
    this.rendererAdapter.setAttribute(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(el, SerializerTypes.STORE_OBJECT),
      fnArg(name),
      fnArg(value),
      fnArg(namespace)
    );
  }

  setProperty(el: any, name: string, value: any): void {
    this.rendererAdapter.setProperty(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(el, SerializerTypes.STORE_OBJECT),
      fnArg(name),
      fnArg(value)
    );
  }

  setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2): void {
    this.rendererAdapter.setStyle(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(el, SerializerTypes.STORE_OBJECT),
      fnArg(style),
      fnArg(value),
      fnArg(flags)
    );
  }

  setValue(node: any, value: string): void {
    this.rendererAdapter.setValue(
      fnArg(this, SerializerTypes.STORE_OBJECT),
      fnArg(node, SerializerTypes.STORE_OBJECT),
      fnArg(value)
    );
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

}
