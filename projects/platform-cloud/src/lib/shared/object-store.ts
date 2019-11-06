import { Injectable, OnDestroy } from '@angular/core';
import { AllocatedNode } from './api';

@Injectable({ providedIn: 'root' })
export class ObjectStore implements OnDestroy {
  private id = 0;
  private lookupByObject = new Map<AllocatedNode, number>();
  private lookupById = new Map<number, AllocatedNode>();

  allocateId(): number {
    return this.id++;
  }

  allocateNode(
    element: AllocatedNode | any = new AllocatedNode(),
    id = this.allocateId()
  ): AllocatedNode {
    this.store(element, id);
    return element;
  }

  deallocateNode(node: AllocatedNode | any): void {
    const id = this.lookupByObject.get(node);
    this.lookupByObject.delete(node);
    this.lookupById.delete(id);
  }

  store(obj: AllocatedNode, id: number): void {
    this.lookupByObject.set(obj, id);
    this.lookupById.set(id, obj);
  }

  serialize(obj: AllocatedNode): number {
    return this.lookupByObject.has(obj)
      ? this.lookupByObject.get(obj)
      : null;
  }

  deserialize(id: number): AllocatedNode | any {
    return this.lookupById.has(id)
      ? this.lookupById.get(id)
      : null;
  }

  clear(): void {
    this.lookupByObject.clear();
    this.lookupById.clear();
  }

  ngOnDestroy(): void {
    this.clear();
  }

}

