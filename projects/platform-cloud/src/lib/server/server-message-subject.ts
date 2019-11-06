import { Subject } from 'rxjs';
import { CommandType } from '../shared';

export abstract class ServerCommandSubject extends Subject<CommandType> {}
export abstract class BrowserCommandSubject extends Subject<CommandType> {}
