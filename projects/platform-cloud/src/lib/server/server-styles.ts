import {DOCUMENT, ɵgetDOM as getDOM} from '@angular/common';
import {Inject, Injectable, OnDestroy} from '@angular/core';
import { SharedStylesHost } from '../shared';

@Injectable()
export class ServerStylesHost extends SharedStylesHost implements OnDestroy {
  private hostNodes = new Set<Node>();
  private styleNodes = new Set<Node>();
  constructor(@Inject(DOCUMENT) private doc: any) {
    super();
    this.hostNodes.add(doc.head);
  }

  private _addStylesToHost(styles: Set<string>, host: Node): void {
    styles.forEach((style: string) => {
      const styleEl = this.doc.createElement('style');
      styleEl.textContent = style;
      this.styleNodes.add(host.appendChild(styleEl));
    });
  }

  addHost(hostNode: Node): void {
    this._addStylesToHost(this.styleNodes as any, hostNode);
    this.hostNodes.add(hostNode);
  }

  removeHost(hostNode: Node): void { this.hostNodes.delete(hostNode); }

  onStylesAdded(additions: Set<string>): void {
    this.hostNodes.forEach(hostNode => this._addStylesToHost(additions, hostNode));
  }

  ngOnDestroy(): void { this.styleNodes.forEach(styleNode => getDOM().remove(styleNode)); }
}
