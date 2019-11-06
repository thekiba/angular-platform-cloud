import { Injectable } from '@angular/core';
import { EventEmitter } from '../shared';

@Injectable()
export class ServerGlobalEvents extends EventEmitter {}
