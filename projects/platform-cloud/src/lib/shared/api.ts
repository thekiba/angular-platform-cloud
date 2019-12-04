import { RendererType2 } from '@angular/core';
import { AnimationEngineMethods } from './animation-engine-adapter';
import { LocationMethods } from './location-adapter';
import { RendererMethods2 } from './renderer-adapter';

export enum SerializerTypes {
  PRIMITIVE = 0,
  STORE_OBJECT = 1,
  RENDERER_TYPE_2 = 2,
  DOM_EVENT = 3
}

export interface SerializedArg {
  type: SerializerTypes;
  value: any;
}

export interface PrimitiveArg {
  type: typeof SerializerTypes.PRIMITIVE;
  value: any;
}

export interface StoreObjectArg {
  type: typeof SerializerTypes.STORE_OBJECT;
  value: any;
}

export interface RendererType2Arg {
  type: typeof SerializerTypes.RENDERER_TYPE_2;
  value: RendererType2;
}

export interface DomEventArg {
  type: typeof SerializerTypes.DOM_EVENT;
  value: any;
}

export const DOM_EVENT_KEYS = [
  'altKey', 'altkey', 'bubbles', 'button', 'button', 'cancelable', 'charCode',
  'clientX', 'clientY', 'code', 'ctrlKey', 'elapsedTime', 'input', 'isComposing',
  'key', 'keyCode', 'li', 'location', 'metaKey', 'metaKey', 'meter', 'movementX',
  'movementY', 'offsetX', 'offsetY', 'option', 'param', 'progress', 'propertyName',
  'pseudoElement', 'region', 'repeat', 'screenX', 'screenY', 'select', 'shiftKey',
  'shiftKey', 'textarea', 'type', 'which'
];

export type FnArg =
  | SerializedArg
  | PrimitiveArg
  | StoreObjectArg
  | RendererType2Arg
  | DomEventArg;

export function isPrimitiveArg(type: SerializerTypes): boolean {
  return type === SerializerTypes.PRIMITIVE;
}

export function isStoreObjectArg(type: SerializerTypes): boolean {
  return type === SerializerTypes.STORE_OBJECT;
}

export function isRendererType2Arg(type: SerializerTypes): boolean {
  return type === SerializerTypes.RENDERER_TYPE_2;
}

export function isDomEventTypeArg(type: SerializerTypes): boolean {
  return type === SerializerTypes.DOM_EVENT;
}

export function fnArg(value: any, type?: SerializerTypes.PRIMITIVE): PrimitiveArg;
export function fnArg(value: object, type: SerializerTypes.STORE_OBJECT): StoreObjectArg;
export function fnArg(value: RendererType2, type: SerializerTypes.RENDERER_TYPE_2): RendererType2Arg;
export function fnArg(value: any, type: SerializerTypes.DOM_EVENT): DomEventArg;
export function fnArg(value: any = null, type: SerializerTypes = SerializerTypes.PRIMITIVE): SerializedArg {
  return { type, value };
}

export class EventEmitter {
  private listeners = new Map<string, Function[]>();

  listen(eventName: string, listener: Function): Function {
    this.getListeners(eventName).push(listener);
    return () => this.unlisten(eventName, listener);
  }

  unlisten(eventName: string, listener: Function): void {
    const listeners = this.getListeners(eventName);
    const index = listeners.indexOf(listener);
    if (index >= 0) {
      listeners.splice(index, 1);
    }
  }

  emit<T>(eventName: string, event: T): void {
    const listeners = this.getListeners(eventName);
    for (const listener of listeners) {
      listener(event);
    }
  }

  private getListeners(eventName: string): Function[] {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    return this.listeners.get(eventName);
  }
}

export class AllocatedNode {
  events = new EventEmitter();
  nodeType = 1; // ???
}

export interface RendererCommand {
  target: 'renderer';
  method: RendererMethods2;
  fnArgs: any[];
}

export interface LocationCommand {
  target: 'location';
  method: LocationMethods;
  fnArgs: any[];
}

export interface AnimationEngineCommand {
  target: 'animation-engine';
  method: AnimationEngineMethods;
  fnArgs: any[];
}

export type CommandType =
  | RendererCommand
  | LocationCommand
  | AnimationEngineCommand;

export function command(target: 'renderer', method: RendererMethods2, fnArgs: any[]): CommandType;
export function command(target: 'location', method: LocationMethods, fnArgs: any[]): CommandType;
export function command(target: 'animation-engine', method: AnimationEngineMethods, fnArgs: any[]): CommandType;
export function command(target: any, method: any, fnArgs: any[]): CommandType {
  return { target, method, fnArgs };
}
