import { Injectable, RendererType2 } from '@angular/core';
import { isPrimitiveArg, isStoreObjectArg, isRendererType2Arg, SerializerTypes } from './api';
import { ObjectStore } from './object-store';

@Injectable({ providedIn: 'root' })
export class Serializer {

  constructor(private store: ObjectStore) {}

  serialize(value: any, type: SerializerTypes = SerializerTypes.PRIMITIVE): Object {
    if (value === null || isPrimitiveArg(type)) {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map(_ => this.serialize(_, type));
    }
    if (isStoreObjectArg(type)) {
      return this.store.serialize(value);
    }
    if (isRendererType2Arg(type)) {
      return this.serializeRendererType2(value);
    }
    throw new Error(`No found serializer for ${SerializerTypes[type]}`);
  }

  deserialize(value: any, type: SerializerTypes = SerializerTypes.PRIMITIVE): any {
    if (value === null || isPrimitiveArg(type)) {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map(_ => this.deserialize(_, type));
    }
    if (isStoreObjectArg(type)) {
      return this.store.deserialize(value);
    }
    if (isRendererType2Arg(type)) {
      return this.deserializeRendererType2(value);
    }
    throw new Error(`No found deserializer for ${SerializerTypes[type]}`);
  }

  private serializeRendererType2(type: RendererType2): {[P in keyof RendererType2]: any} {
    return {
      id: type.id,
      encapsulation: this.serialize(type.encapsulation),
      styles: this.serialize(type.styles),
      data: this.serialize(type.data)
    };
  }

  private deserializeRendererType2(type: {[P in keyof RendererType2]: any}): RendererType2 {
    return {
      id: type.id,
      encapsulation: this.deserialize(type.encapsulation),
      styles: this.deserialize(type.styles),
      data: this.deserialize(type.data)
    };
  }

}
