import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommandType, fnArg, MessageBus, RendererAdapter2, SerializerTypes } from '../shared';

@Injectable()
export class BrowserMain implements OnDestroy {

  private subscription: Subscription;

  constructor(private bus: MessageBus, private adapter: RendererAdapter2) {
    this.subscription = this.bus.getCommands().subscribe(
      (command) => this.processCommand(command));
  }

  processCommand(command: CommandType): void {
    if (command.target === 'renderer') {
      this.processRendererCommand(command);
    }
  }

  private processRendererCommand(command: CommandType) {
    const next = toIterator(command.fnArgs);
    switch (command.method) {
      case 'createRenderer':
        this.adapter.createRenderer(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.RENDERER_TYPE_2),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'destroyNode':
        this.adapter.destroyNode(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'addClass':
        this.adapter.addClass(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next())
        );
        break;
      case 'appendChild':
        this.adapter.appendChild(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'createComment':
        this.adapter.createComment(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'createElement':
        this.adapter.createElement(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next()),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'createText':
        this.adapter.createText(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'destroy':
        this.adapter.destroy(
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'insertBefore':
        this.adapter.insertBefore(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'listen':
        this.adapter.listen(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next()),
          fnArg(next())
        );
        break;
      case 'unlisten':
        this.adapter.unlisten(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next())
        );
        break;
      case 'nextSibling':
        this.adapter.nextSibling(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'parentNode':
        this.adapter.parentNode(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'removeAttribute':
        this.adapter.removeAttribute(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next())
        );
        break;
      case 'removeChild':
        this.adapter.removeChild(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next())
        );
        break;
      case 'removeClass':
        this.adapter.removeClass(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next())
        );
        break;
      case 'removeStyle':
        this.adapter.removeStyle(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next())
        );
        break;
      case 'selectRootElement':
        this.adapter.selectRootElement(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next()),
          fnArg(next(), SerializerTypes.STORE_OBJECT)
        );
        break;
      case 'setAttribute':
        this.adapter.setAttribute(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next()),
          fnArg(next())
        );
        break;
      case 'setProperty':
        this.adapter.setProperty(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next())
        );
        break;
      case 'setStyle':
        this.adapter.setStyle(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next()),
          fnArg(next()),
          fnArg(next())
        );
        break;
      case 'setValue':
        this.adapter.setValue(
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next(), SerializerTypes.STORE_OBJECT),
          fnArg(next())
        );
        break;
      default:
        throw new Error(`Unknown renderer method ${ command.method }`);
    }
  }

  ngOnDestroy(): void {
  }

}

function toIterator(values: any[]): () => any {
  function *_() {
    for (const value of values) {
      yield value;
    }
  }
  const iterator = _();
  return () => iterator.next().value;
}
