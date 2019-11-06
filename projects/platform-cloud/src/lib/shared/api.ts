import { RendererType2 } from '@angular/core';
import { RendererMethods2 } from './renderer-adapter';

export enum SerializerTypes {
  PRIMITIVE = 0,
  STORE_OBJECT = 1,
  RENDERER_TYPE_2 = 2
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

export type FnArg =
  | SerializedArg
  | PrimitiveArg
  | StoreObjectArg
  | RendererType2Arg;

export function isPrimitiveArg(type: SerializerTypes): boolean {
  return type === SerializerTypes.PRIMITIVE;
}

export function isStoreObjectArg(type: SerializerTypes): boolean {
  return type === SerializerTypes.STORE_OBJECT;
}

export function isRendererType2Arg(type: SerializerTypes): boolean {
  return type === SerializerTypes.RENDERER_TYPE_2;
}

export function fnArg(value: any, type?: SerializerTypes.PRIMITIVE): PrimitiveArg;
export function fnArg(value: object, type: SerializerTypes.STORE_OBJECT): StoreObjectArg;
export function fnArg(value: RendererType2, type: SerializerTypes.RENDERER_TYPE_2): RendererType2Arg;
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
}

export interface RendererCommand {
  target: 'renderer';
  method: RendererMethods2;
  fnArgs: any[];
}

export type CommandType =
  | RendererCommand;

export function command(target: 'renderer', method: RendererMethods2, fnArgs: any[]): CommandType {
  return { target, method, fnArgs };
}
