import { Observable } from 'rxjs';
import { EventMessage, RenderMethods } from './api';

export abstract class MessageBus {
  abstract getEvents(): Observable<EventMessage>;

  abstract invoke(method: RenderMethods, fnArgs: any[]): void;
}
