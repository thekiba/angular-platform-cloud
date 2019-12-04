import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import {
  command,
  DomEventArg,
  FnArg,
  fnArg,
  MessageBus,
  ObjectStore,
  PrimitiveArg,
  RendererAdapter2,
  RendererMethods2,
  RendererType2Arg,
  Serializer,
  SerializerTypes,
  StoreObjectArg
} from '../shared';

@Injectable()
export class BrowserRendererAdapter2 extends RendererAdapter2 {

  constructor(private serializer: Serializer, private store: ObjectStore, private factory: RendererFactory2,
              private bus: MessageBus) {
    super();
  }

  begin(): void {
    this.factory.begin();
  }

  end(): void {
    this.factory.end();
  }

  addClass(rendererArg: StoreObjectArg, elArg: StoreObjectArg, nameArg: PrimitiveArg): void {
    const [ renderer, el, name ] = this.deserialize(...arguments);
    if (el.classList) {
      renderer.addClass(el, name);
    }
  }

  appendChild(rendererArg: StoreObjectArg, parentArg: StoreObjectArg, newChildArg: StoreObjectArg): void {
    const [ renderer, parent, newChild ] = this.deserialize(...arguments);
    renderer.appendChild(parent, newChild);
  }

  event(rendererArg: StoreObjectArg, targetElArg: StoreObjectArg, targetNameArg: PrimitiveArg, eventNameArg: PrimitiveArg, eventArg: DomEventArg): void {
    this.callServerRenderer('event', ...arguments);
  }

  createComment(rendererArg: StoreObjectArg, valueArg: PrimitiveArg, commentElementArg: StoreObjectArg): void {
    const [ renderer, value ] = this.deserialize(...arguments);
    const commentElement = renderer.createComment(value);
    this.store.allocateNode(commentElement, commentElementArg.value);
  }

  createElement(rendererArg: StoreObjectArg, nameArg: PrimitiveArg, namespaceArg: PrimitiveArg, elementArg: StoreObjectArg): void {
    const [ renderer, name, namespace ] = this.deserialize(...arguments);
    const element = renderer.createElement(name, namespace);
    this.store.allocateNode(element, elementArg.value);
  }

  createRenderer(hostElementArg: StoreObjectArg, typeArg: RendererType2Arg, rendererArg: StoreObjectArg): void {
    const [ hostElement, type ] = this.deserialize(...arguments);
    const renderer = this.factory.createRenderer(hostElement, type);
    this.store.allocateNode(renderer, rendererArg.value);
  }

  createText(rendererArg: StoreObjectArg, valueArg: PrimitiveArg, textElementArg: StoreObjectArg): void {
    const [ renderer, value ] = this.deserialize(...arguments);
    const textElement = renderer.createText(value);
    this.store.allocateNode(textElement, textElementArg.value);
  }

  destroy(rendererArg: StoreObjectArg): void {
    const [ renderer ] = this.deserialize(...arguments);
    renderer.destroy();
    this.store.deallocateNode(renderer);
  }

  destroyNode(rendererArg: StoreObjectArg, nodeArg: StoreObjectArg): void {
    const [renderer, node] = this.deserialize(...arguments);
    if (renderer.destroyNode) {
      renderer.destroyNode(node);
    }
    this.store.deallocateNode(node);
  }

  insertBefore(rendererArg: StoreObjectArg, parentArg: StoreObjectArg, newChildArg: StoreObjectArg, refChildArg: StoreObjectArg): void {
    const [ renderer, parent, newChild, refChild ] = this.deserialize(...arguments);
    renderer.insertBefore(parent, newChild, refChild);
  }

  listen(
    rendererArg: StoreObjectArg, targetElArg: StoreObjectArg, targetNameArg: PrimitiveArg, eventNameArg: PrimitiveArg,
    listenIdArg: PrimitiveArg
  ): void {
    const [ renderer, targetEl, targetName, eventName, listenId ] = this.deserialize(...arguments);
    const unlisten = renderer.listen(targetEl || targetName, eventName, (event) => {
        this.event(
          fnArg(renderer, SerializerTypes.STORE_OBJECT),
          fnArg(targetEl, SerializerTypes.STORE_OBJECT),
          fnArg(targetName),
          fnArg(eventName),
          fnArg(event, SerializerTypes.DOM_EVENT)
        );
        return false;
      }
    );
    this.store.allocateNode(unlisten, listenId);
  }

  nextSibling(rendererArg: StoreObjectArg, nodeArg: StoreObjectArg, elementArg: StoreObjectArg): void {
    const [ renderer, node ] = this.deserialize(...arguments);
    const element = renderer.nextSibling(node);
    this.store.allocateNode(element, elementArg.value);
  }

  parentNode(rendererArg: StoreObjectArg, nodeArg: StoreObjectArg, elementArg: StoreObjectArg): void {
    const [ renderer, node ] = this.deserialize(...arguments);
    const element = renderer.parentNode(node);
    this.store.allocateNode(element, elementArg.value);
  }

  removeAttribute(rendererArg: StoreObjectArg, elArg: StoreObjectArg, nameArg: PrimitiveArg, namespaceArg: PrimitiveArg): void {
    const [ renderer, el, name, namespace ] = this.deserialize(...arguments);
    renderer.removeAttribute(el, name, namespace);
  }

  removeChild(rendererArg: StoreObjectArg, parentArg: StoreObjectArg, oldChildArg: StoreObjectArg, isHostElementArg: PrimitiveArg): void {
    const [ renderer, parent, oldChild, isHostElement ] = this.deserialize(...arguments);
    renderer.removeChild(parent, oldChild, isHostElement);
  }

  removeClass(rendererArg: StoreObjectArg, elArg: StoreObjectArg, nameArg: PrimitiveArg): void {
    const [ renderer, el, name ] = this.deserialize(...arguments);
    if (el.classList) {
      renderer.removeClass(el, name);
    }
  }

  removeStyle(rendererArg: StoreObjectArg, elArg: StoreObjectArg, styleArg: PrimitiveArg, flagsArg: PrimitiveArg): void {
    const [ renderer, el, style, flags ] = this.deserialize(...arguments);
    renderer.removeStyle(el, style, flags);
  }

  selectRootElement(
    rendererArg: StoreObjectArg, selectorOrNodeArg: PrimitiveArg, preserveContentArg: PrimitiveArg, rootElementArg: StoreObjectArg): void {
    const [ renderer, selector, preserveContent ] = this.deserialize(...arguments);
    const rootElement = renderer.selectRootElement(selector, preserveContent);
    this.store.allocateNode(rootElement, rootElementArg.value);
  }

  setAttribute(
    rendererArg: StoreObjectArg, elArg: StoreObjectArg, nameArg: PrimitiveArg, valueArg: PrimitiveArg, namespaceArg: PrimitiveArg): void {
    const [ renderer, el, name, value, namespace ] = this.deserialize(...arguments);
    renderer.setAttribute(el, name, value, namespace);
  }

  setProperty(rendererArg: StoreObjectArg, elArg: StoreObjectArg, nameArg: PrimitiveArg, valueArg: PrimitiveArg): void {
    const [ renderer, el, name, value ] = this.deserialize(...arguments);
    renderer.setProperty(el, name, value);
  }

  setStyle(
    rendererArg: StoreObjectArg, elArg: StoreObjectArg, styleArg: PrimitiveArg, valueArg: PrimitiveArg, flagsArg: PrimitiveArg): void {
    const [ renderer, el, style, value, flags ] = this.deserialize(...arguments);
    renderer.setStyle(el, style, value, flags);
  }

  setValue(rendererArg: StoreObjectArg, nodeArg: StoreObjectArg, valueArg: PrimitiveArg): void {
    const [ renderer, node, value ] = this.deserialize(...arguments);
    renderer.setValue(node, value);
  }

  unlisten(rendererArg: StoreObjectArg, listenIdArg: PrimitiveArg): void {
    const [ renderer, listenId ] = this.deserialize(...arguments);
    const unlisten = this.store.deserialize(listenId);
    if (typeof unlisten === 'function') {
      unlisten();
    }
    this.store.deallocateNode(unlisten);
  }

  private callServerRenderer(method: RendererMethods2, ...fnArgs: FnArg[]): void {
    const payload = fnArgs.map(arg => this.serializer.serialize(arg.value, arg.type));
    this.bus.sendCommand(command('renderer', method, payload));
  }

  private deserialize(...fnArgs: FnArg[]): [ Renderer2, ...any[] ] {
    return fnArgs.map(arg => this.serializer.deserialize(arg.value, arg.type)) as [ Renderer2, ...any[] ];
  }

}
