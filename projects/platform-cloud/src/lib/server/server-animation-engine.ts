import { AnimationTriggerMetadata } from '@angular/animations';
import {
  AnimationDriver,
  ɵAnimationEngine as AnimationEngine,
  ɵAnimationStyleNormalizer as AnimationStyleNormalizer
} from '@angular/animations/browser';
import { AnimationEngineAdapter, ObjectStore, SerializerTypes } from '../shared';
import { fnArg } from '../shared/api';

export class ServerAnimationEngine extends AnimationEngine {

  onRemovalComplete: (element: any, context: any) => void;

  constructor(
    bodyNode: any, driver: AnimationDriver, normalizer: AnimationStyleNormalizer,
    private adapter: AnimationEngineAdapter, private store: ObjectStore
  ) {
    super(bodyNode, driver, normalizer);

    this.onRemovalComplete = (element: any, context: any) => {
      this.adapter.onRemovalComplete(
        fnArg(element, SerializerTypes.STORE_OBJECT),
        fnArg(context, SerializerTypes.STORE_OBJECT)
      );
    };
  }

  destroy(namespaceId: string, context: any): void {
    this.adapter.destroy(
      fnArg(namespaceId),
      fnArg(context, SerializerTypes.STORE_OBJECT)
    );
  }

  disableAnimations(element: any, disable: boolean): void {
    this.adapter.disableAnimations(
      fnArg(element, SerializerTypes.STORE_OBJECT),
      fnArg(disable)
    );
  }

  flush(microtaskId?: number): void {
    this.adapter.flush(
      fnArg(microtaskId)
    );
  }

  listen(namespaceId: string, element: any, eventName: string, eventPhase: string, callback: (event: any) => any): () => any {
    const listenId = this.allocateId();
    const unlisten: Function = element.events.listen(eventName, callback);

    this.adapter.listen(
      fnArg(namespaceId),
      fnArg(element, SerializerTypes.STORE_OBJECT),
      fnArg(eventName),
      fnArg(eventPhase),
      fnArg(listenId)
    );

    return () => {
      this.adapter.unlisten(fnArg(listenId));
      unlisten();
    };
  }

  onInsert(namespaceId: string, element: any, parent: any, insertBefore: boolean): void {
    this.adapter.onInsert(
      fnArg(namespaceId),
      fnArg(element, SerializerTypes.STORE_OBJECT),
      fnArg(parent, SerializerTypes.STORE_OBJECT),
      fnArg(insertBefore)
    );
  }

  onRemove(namespaceId: string, element: any, context: any, isHostElement?: boolean): void {
    this.adapter.onRemove(
      fnArg(namespaceId),
      fnArg(element, SerializerTypes.STORE_OBJECT),
      fnArg(context, SerializerTypes.STORE_OBJECT),
      fnArg(isHostElement)
    );
  }

  process(namespaceId: string, element: any, property: string, value: any): void {
    this.adapter.process(
      fnArg(namespaceId),
      fnArg(element, SerializerTypes.STORE_OBJECT),
      fnArg(property),
      fnArg(value)
    );
  }

  register(namespaceId: string, hostElement: any): void {
    this.adapter.register(
      fnArg(namespaceId),
      fnArg(hostElement, SerializerTypes.STORE_OBJECT)
    );
  }

  registerTrigger(componentId: string, namespaceId: string, hostElement: any, name: string, metadata: AnimationTriggerMetadata): void {
    this.adapter.registerTrigger(
      fnArg(componentId),
      fnArg(namespaceId),
      fnArg(hostElement, SerializerTypes.STORE_OBJECT),
      fnArg(name),
      fnArg(metadata)
    );
  }

  whenRenderingDone(): Promise<any> {
    return undefined;
  }

  private allocateId(): number {
    return this.store.allocateId();
  }

}
