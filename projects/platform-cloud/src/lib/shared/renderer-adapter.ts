import { DomEventArg, PrimitiveArg, RendererType2Arg, StoreObjectArg } from './api';

export type RendererMethods2 = keyof RendererAdapter2;

export abstract class RendererAdapter2 {

  abstract createRenderer(hostElementArg: StoreObjectArg, typeArg: RendererType2Arg, rendererArg: StoreObjectArg): void;

  abstract destroyNode(rendererArg: StoreObjectArg, nodeArg: StoreObjectArg): void;

  abstract addClass(rendererArg: StoreObjectArg, elArg: StoreObjectArg, nameArg: PrimitiveArg): void;

  abstract appendChild(rendererArg: StoreObjectArg, parentArg: StoreObjectArg, newChildArg: StoreObjectArg): void;

  abstract event(rendererArg: StoreObjectArg, targetElArg: StoreObjectArg, targetNameArg: PrimitiveArg, eventNameArg: PrimitiveArg, eventArg: DomEventArg): void;

  abstract createComment(rendererArg: StoreObjectArg, valueArg: PrimitiveArg, commentElementArg: StoreObjectArg): void;

  abstract createElement(rendererArg: StoreObjectArg, nameArg: PrimitiveArg, namespaceArg: PrimitiveArg, elementArg: StoreObjectArg): void;

  abstract createText(rendererArg: StoreObjectArg, valueArg: PrimitiveArg, textElementArg: StoreObjectArg): void;

  abstract destroy(rendererArg: StoreObjectArg): void;

  abstract insertBefore(rendererArg: StoreObjectArg, parentArg: StoreObjectArg, newChildArg: StoreObjectArg, refChildArg: StoreObjectArg): void;

  abstract listen(rendererArg: StoreObjectArg, targetElArg: StoreObjectArg, targetNameArg: PrimitiveArg, eventNameArg: PrimitiveArg,
                  listenIdArg: PrimitiveArg
  ): void;

  abstract unlisten(rendererArg: StoreObjectArg, listenIdArg: PrimitiveArg): void;

  abstract nextSibling(rendererArg: StoreObjectArg, nodeArg: StoreObjectArg, elementArg: StoreObjectArg): void;

  abstract parentNode(rendererArg: StoreObjectArg, nodeArg: StoreObjectArg, elementArg: StoreObjectArg): void;

  abstract removeAttribute(rendererArg: StoreObjectArg, elArg: StoreObjectArg, nameArg: PrimitiveArg, namespaceArg: PrimitiveArg): void;

  abstract removeChild(rendererArg: StoreObjectArg, parentArg: StoreObjectArg, oldChildArg: StoreObjectArg, isHostElementArg: PrimitiveArg): void;

  abstract removeClass(rendererArg: StoreObjectArg, elArg: StoreObjectArg, nameArg: PrimitiveArg): void;

  abstract removeStyle(rendererArg: StoreObjectArg, elArg: StoreObjectArg, styleArg: PrimitiveArg, flagsArg: PrimitiveArg): void;

  abstract selectRootElement(rendererArg: StoreObjectArg, selectorOrNodeArg: PrimitiveArg, preserveContentArg: PrimitiveArg,
                             rootElementArg: StoreObjectArg
  ): void;

  abstract setAttribute(
    rendererArg: StoreObjectArg, elArg: StoreObjectArg, nameArg: PrimitiveArg, valueArg: PrimitiveArg, namespaceArg: PrimitiveArg): void;

  abstract setProperty(rendererArg: StoreObjectArg, elArg: StoreObjectArg, nameArg: PrimitiveArg, valueArg: PrimitiveArg): void;

  abstract setStyle(rendererArg: StoreObjectArg, elArg: StoreObjectArg, styleArg: PrimitiveArg, valueArg: PrimitiveArg, flagsArg: PrimitiveArg): void;

  abstract setValue(rendererArg: StoreObjectArg, nodeArg: StoreObjectArg, valueArg: PrimitiveArg): void;

}
