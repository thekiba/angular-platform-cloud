import { ViewportScroller } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class ServerViewportScroller extends ViewportScroller {
  getScrollPosition(): [number, number] {
    return [0, 0];
  }

  scrollToAnchor(anchor: string): void {
  }

  scrollToPosition(position: [number, number]): void {
  }

  setHistoryScrollRestoration(scrollRestoration: "auto" | "manual"): void {
  }

  setOffset(offset: [number, number] | (() => [number, number])): void {
  }
}
