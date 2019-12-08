import { DomEventArg, PrimitiveArg, RendererType2Arg, StoreObjectArg } from './api';

export type AnimationEngineMethods = keyof AnimationEngineAdapter;

export abstract class AnimationEngineAdapter {

  abstract destroy(namespaceIdArg: PrimitiveArg, contextArg: StoreObjectArg): void;

  abstract disableAnimations(elementArg: StoreObjectArg, disableArg: PrimitiveArg): void;

  abstract flush(microtaskIdArg: PrimitiveArg): void;

  abstract event(elementArg: StoreObjectArg, eventNameArg: PrimitiveArg, eventArg: DomEventArg): void;

  abstract listen(
    namespaceIdArg: PrimitiveArg, elementArg: StoreObjectArg, eventNameArg: PrimitiveArg, eventPhaseArg: PrimitiveArg,
    listenIdArg: PrimitiveArg
  ): void;

  abstract unlisten(listenIdArg: PrimitiveArg): void;

  abstract onInsert(namespaceIdArg: PrimitiveArg, elementArg: StoreObjectArg, parentArg: StoreObjectArg, insertBeforeArg: PrimitiveArg): void;

  abstract onRemove(namespaceIdArg: PrimitiveArg, elementArg: StoreObjectArg, contextArg: StoreObjectArg, isHostElementArg: PrimitiveArg): void;

  abstract onRemovalComplete(elementArg: StoreObjectArg, contextArg: StoreObjectArg): void;

  abstract process(namespaceIdArg: PrimitiveArg, elementArg: StoreObjectArg, propertyArg: PrimitiveArg, valueArg: PrimitiveArg): void;

  abstract register(namespaceIdArg: PrimitiveArg, hostElementArg: StoreObjectArg): void;

  abstract registerTrigger(
    componentIdArg: PrimitiveArg, namespaceIdArg: PrimitiveArg, hostElementArg: StoreObjectArg, nameArg: PrimitiveArg,
    metadataArg: PrimitiveArg
  ): void;

}
