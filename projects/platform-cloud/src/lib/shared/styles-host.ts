import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SharedStylesHost {

  protected stylesSet = new Set<string>();

  addStyles(styles: string[]): void {
    const additions = new Set<string>();
    styles.forEach(style => {
      if (!this.stylesSet.has(style)) {
        this.stylesSet.add(style);
        additions.add(style);
      }
    });
    this.onStylesAdded(additions);
  }

  onStylesAdded(additions: Set<string>): void {}

  getAllStyles(): string[] { return Array.from(this.stylesSet); }
}
