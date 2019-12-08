import { Injectable, NgZone } from '@angular/core';
import {
  AnimationEngineAdapter,
  AnimationEngineMethods,
  command,
  DomEventArg,
  FnArg,
  MessageBus,
  PrimitiveArg,
  Serializer,
  StoreObjectArg
} from '../shared';

@Injectable()
export class ServerAnimationEngineAdapter extends AnimationEngineAdapter {

  constructor(private bus: MessageBus, private serializer: Serializer, private ngZone: NgZone) { super(); }

  destroy(namespaceIdArg: PrimitiveArg, contextArg: StoreObjectArg): void {
    this.callBrowserAnimationEngine('destroy', ...arguments);
  }

  disableAnimations(elementArg: StoreObjectArg, disableArg: PrimitiveArg): void {
    this.callBrowserAnimationEngine('disableAnimations', ...arguments);
  }

  flush(microtaskIdArg: PrimitiveArg): void {
    this.callBrowserAnimationEngine('flush', ...arguments);
  }

  event(elementArg: StoreObjectArg, eventNameArg: PrimitiveArg, eventArg: DomEventArg): void {
    const [ element, eventName, event ] = this.deserialize(...arguments);

    this.ngZone.run(() => {
      element.events.emit(eventName, event);
    });
  }

  listen(
    namespaceIdArg: PrimitiveArg, elementArg: StoreObjectArg, eventNameArg: PrimitiveArg, eventPhaseArg: PrimitiveArg,
    listenIdArg: PrimitiveArg
  ): void {
    this.callBrowserAnimationEngine('listen', ...arguments);
  }

  onInsert(namespaceIdArg: PrimitiveArg, elementArg: StoreObjectArg, parentArg: StoreObjectArg, insertBeforeArg: PrimitiveArg): void {
    this.callBrowserAnimationEngine('onInsert', ...arguments);
  }

  onRemove(namespaceIdArg: PrimitiveArg, elementArg: StoreObjectArg, contextArg: StoreObjectArg, isHostElementArg: PrimitiveArg): void {
    this.callBrowserAnimationEngine('onRemove', ...arguments);
  }

  onRemovalComplete(elementArg: StoreObjectArg, contextArg: StoreObjectArg): void {
    this.callBrowserAnimationEngine('onRemovalComplete', ...arguments);
  }

  process(namespaceIdArg: PrimitiveArg, elementArg: StoreObjectArg, propertyArg: PrimitiveArg, valueArg: PrimitiveArg): void {
    this.callBrowserAnimationEngine('process', ...arguments);
  }

  register(namespaceIdArg: PrimitiveArg, hostElementArg: StoreObjectArg): void {
    this.callBrowserAnimationEngine('register', ...arguments);
  }

  registerTrigger(
    componentIdArg: PrimitiveArg, namespaceIdArg: PrimitiveArg, hostElementArg: StoreObjectArg, nameArg: PrimitiveArg,
    metadataArg: PrimitiveArg
  ): void {
    this.callBrowserAnimationEngine('registerTrigger', ...arguments);
  }

  unlisten(listenIdArg: PrimitiveArg): void {
    this.callBrowserAnimationEngine('unlisten', ...arguments);
  }

  private callBrowserAnimationEngine(method: AnimationEngineMethods, ...fnArgs: FnArg[]): void {
    const payload = fnArgs.map(arg => this.serializer.serialize(arg.value, arg.type));
    this.bus.sendCommand(command('animation-engine', method, payload));
  }

  private deserialize(...fnArgs: FnArg[]): [ ...any[] ] {
    return fnArgs.map(arg => this.serializer.deserialize(arg.value, arg.type)) as [ ...any[] ];
  }

}
