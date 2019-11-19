import './polyfills';
import { enableProdMode, PlatformRef, StaticProvider } from '@angular/core';
import { BrowserCommandSubject, CommandType, ServerCommandSubject, DEFAULT_LOCATION_STATE } from '@angular/platform-cloud';
import { bootstrapCloudServerDynamic } from '@angular/platform-cloud-dynamic';
import * as express from 'express';
import * as expressWs from 'express-ws';
import { Subject } from 'rxjs';
import { AppModule } from './app/app.module';

/**
 * ✨🦊 Hi there, folks!
 *
 * You can see a lot of dirty code below
 * That is not production-ready yet
 * That will be removed that in the future
 *
 * Thanks for your interesting in Angular Platform Cloud!
 */

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

const app = express();
expressWs(app);

const router = express.Router();
router.ws('/cloud', (ws, req) => {
  const fromServer = new Subject<CommandType>();
  const fromServerSubscription = fromServer.subscribe((command: CommandType) => {
    if (![ws.CLOSED, ws.CLOSING].includes(ws.readyState)) {
      ws.send(JSON.stringify(command));
    }
  });

  const fromBrowser = new Subject<CommandType>();
  ws.on('message', (message) => {
    const command: CommandType = JSON.parse(message.toString('utf-8'));
    fromBrowser.next(command);
  });

  let ref: PlatformRef;
  const defaultLocationState = {
    location: null,
    baseHref: null,
    state: null
  };
  const beforeStartListener = (message) => {
    const command: CommandType = JSON.parse(message.toString('utf-8'));

    // Todo: cleanup below
    if (command.method === 'getBaseHrefFromDOM') {
      defaultLocationState.baseHref = command.fnArgs[0];
    }

    if (command.method === 'getState') {
      defaultLocationState.state = command.fnArgs[0];
    }

    if (command.method === 'getLocation') {
      defaultLocationState.location = command.fnArgs[0];

      const BOOTSTRAP_PROVIDERS: StaticProvider[] = [
        { provide: ServerCommandSubject, useValue: fromServer },
        { provide: BrowserCommandSubject, useValue: fromBrowser },
        { provide: DEFAULT_LOCATION_STATE, useValue: defaultLocationState }
      ];

      bootstrapCloudServerDynamic(BOOTSTRAP_PROVIDERS).then(async (_) => {
        ref = _;
        await ref.bootstrapModule(AppModule);
      });

      ws.removeEventListener('message', beforeStartListener);
    }
  };

  ws.on('message', beforeStartListener);

  ws.on('close', () => {
    try {
      if (ref) {
        ref.destroy();
        ref = null;
      }

      if (fromServerSubscription) {
        fromServerSubscription.unsubscribe();
      }
    } catch (e) {}
  });
});

app.use(router);

const server = app.listen(3000, () =>
  console.log('Server ready, listen: 0.0.0.0:3000'));

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});
process.on('uncaughtException', (err) => {
  console.log(err);
});

