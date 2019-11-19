import { DOCUMENT } from '@angular/common';
import { Inject, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CommandType, MessageBus } from '../shared';

export class BrowserMessageBus extends MessageBus implements OnDestroy {
  ws: WebSocket;
  commands: Subject<CommandType> = new Subject<CommandType>();
  buf: CommandType[] = [];

  constructor(@Inject(DOCUMENT) private document: any) {
    super();

    const ws = this.ws = new WebSocket('ws://127.0.0.1:3000/cloud');
    ws.onmessage = (message) => this.processMessage(message);
    ws.onclose = () => this.reload();
    ws.onopen = () => this.onopen();

    setTimeout(() =>
      this.ws.readyState !== this.ws.OPEN && this.ws.close(), 1000);
  }

  getCommands(): Observable<CommandType> {
    return this.commands.asObservable();
  }

  sendCommand(command: CommandType): void {
    if (this.ws.readyState === this.ws.OPEN) {
      this.ws.send(JSON.stringify(command));
    } else {
      this.buf.push(command);
    }
  }

  ngOnDestroy(): void {
    if (![this.ws.CLOSED, this.ws.CLOSING].includes(this.ws.readyState)) {
      this.ws.close();
      this.ws = null;
    }
  }

  private processMessage(message: MessageEvent): void {
    const command: CommandType = JSON.parse(message.data);
    this.commands.next(command);
  }

  private onopen(): void {
    this.buf.forEach(command => this.sendCommand(command));
    this.buf = [];
  }

  private reload(): void {
    console.log('[RELOAD] Restarting...');
    setTimeout(() => this.document.location.reload(), 1000);
  }
}
