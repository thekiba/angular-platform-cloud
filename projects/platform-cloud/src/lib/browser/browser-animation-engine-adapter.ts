import { ɵAnimationEngine as AnimationEngine } from '@angular/animations/browser';
import { Injectable } from '@angular/core';
import {
  AnimationEngineAdapter, AnimationEngineMethods, command,
  DomEventArg,
  fnArg,
  FnArg, MessageBus,
  ObjectStore,
  PrimitiveArg,
  Serializer,
  SerializerTypes,
  StoreObjectArg
} from '../shared';

@Injectable()
export class BrowserAnimationEngineAdapter extends AnimationEngineAdapter {
  constructor(private engine: AnimationEngine, private serializer: Serializer, private store: ObjectStore,
              private bus: MessageBus) {
    super();
  }

  destroy(namespaceIdArg: PrimitiveArg, contextArg: StoreObjectArg): void {
    const [ namespaceId, context ] = this.deserialize(...arguments);
    this.engine.destroy(namespaceId, context);
  }

  disableAnimations(elementArg: StoreObjectArg, disableArg: PrimitiveArg): void {
    const [ element, disable ] = this.deserialize(...arguments);
    this.engine.disableAnimations(element, disable);
  }

  flush(microtaskIdArg: PrimitiveArg): void {
    const [ microtaskId ] = this.deserialize(...arguments);
    this.engine.flush(microtaskId);
  }

  event(elementArg: StoreObjectArg, eventNameArg: PrimitiveArg, eventArg: DomEventArg): void {
    this.callServerAnimationEngine('event', ...arguments);
  }

  listen(
    namespaceIdArg: PrimitiveArg, elementArg: StoreObjectArg, eventNameArg: PrimitiveArg, eventPhaseArg: PrimitiveArg,
    listenIdArg: PrimitiveArg
  ): void {
    const [ namespaceId, element, eventName, eventPhase, listenId ] = this.deserialize(...arguments);
    const unlisten = this.engine.listen(namespaceId, element, eventName, eventPhase, (event) => {
        this.event(
          fnArg(element, SerializerTypes.STORE_OBJECT),
          fnArg(eventName),
          fnArg(event, SerializerTypes.DOM_EVENT)
        );
        return false;
      }
    );
    this.store.allocateNode(unlisten, listenId);
  }

  onInsert(namespaceIdArg: PrimitiveArg, elementArg: StoreObjectArg, parentArg: StoreObjectArg, insertBeforeArg: PrimitiveArg): void {
    const [ namespaceId, element, parent, insertBefore ] = this.deserialize(...arguments);
    this.engine.onInsert(namespaceId, element, parent, insertBefore);
  }

  onRemove(namespaceIdArg: PrimitiveArg, elementArg: StoreObjectArg, contextArg: StoreObjectArg, isHostElementArg: PrimitiveArg): void {
    const [ namespaceId, element, context, iHostElement ] = this.deserialize(...arguments);
    this.engine.onRemove(namespaceId, element, context, iHostElement);
  }

  onRemovalComplete(elementArg: StoreObjectArg, contextArg: StoreObjectArg): void {
    const [ element, context ] = this.deserialize(...arguments);
    this.engine.onRemovalComplete(element, context);
  }

  process(namespaceIdArg: PrimitiveArg, elementArg: StoreObjectArg, propertyArg: PrimitiveArg, valueArg: PrimitiveArg): void {
    const [ namespaceId, element, property, value ] = this.deserialize(...arguments);
    this.engine.process(namespaceId, element, property, value);
  }

  register(namespaceIdArg: PrimitiveArg, hostElementArg: StoreObjectArg): void {
    const [ namespaceId, hostElement ] = this.deserialize(...arguments);
    this.engine.register(namespaceId, hostElement);
  }

  registerTrigger(
    componentIdArg: PrimitiveArg, namespaceIdArg: PrimitiveArg, hostElementArg: StoreObjectArg, nameArg: PrimitiveArg,
    metadataArg: PrimitiveArg
  ): void {
    const [ componentId, namespaceId, hostElement, name, metadata ] = this.deserialize(...arguments);
    this.engine.registerTrigger(componentId, namespaceId, hostElement, name, metadata);
  }

  unlisten(listenIdArg: PrimitiveArg): void {
    const [ listenId ] = this.deserialize(...arguments);
    const unlisten = this.store.deserialize(listenId);
    if (typeof unlisten === 'function') {
      unlisten();
    }
    this.store.deallocateNode(unlisten);
  }

  private callServerAnimationEngine(method: AnimationEngineMethods, ...fnArgs: FnArg[]): void {
    const payload = fnArgs.map(arg => this.serializer.serialize(arg.value, arg.type));
    this.bus.sendCommand(command('animation-engine', method, payload));
  }

  private deserialize(...fnArgs: FnArg[]): [ ...any[] ] {
    return fnArgs.map(arg => this.serializer.deserialize(arg.value, arg.type)) as [ ...any[] ];
  }
}
