import { Injectable } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import { EventMessage, MessageBus, RenderMethods } from '../shared';

@Injectable()
export class ServerMessageBus extends MessageBus {

  getEvents(): Observable<EventMessage> {
    return NEVER;
  }

  invoke(method: RenderMethods, fnArgs: any[]): void {
    console.log(method, fnArgs);
  }

}
