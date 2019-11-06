import { Observable } from 'rxjs';
import { CommandType } from './api';

export abstract class MessageBus {
  abstract getCommands(): Observable<CommandType>;
  abstract sendCommand(command: CommandType): void;
}
