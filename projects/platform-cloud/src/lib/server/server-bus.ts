import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommandType, MessageBus } from '../shared';
import { BrowserCommandSubject, ServerCommandSubject } from './server-message-subject';

@Injectable()
export class ServerMessageBus extends MessageBus {

  constructor(private fromServer: ServerCommandSubject,
              private fromBrowser: BrowserCommandSubject) {
    super();
  }

  getCommands(): Observable<CommandType> {
    return this.fromBrowser.asObservable();
  }

  sendCommand(command: CommandType): void {
    this.fromServer.next(command);
  }

}
