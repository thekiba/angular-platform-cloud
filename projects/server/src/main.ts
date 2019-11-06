import './polyfills';
import { enableProdMode, PlatformRef, StaticProvider } from '@angular/core';
import { BrowserCommandSubject, CommandType, ServerCommandSubject } from '@angular/platform-cloud';
import { bootstrapCloudServerDynamic } from '@angular/platform-cloud-dynamic';
import * as express from 'express';
import * as expressWs from 'express-ws';
import { Subject } from 'rxjs';
import { AppModule } from './app/app.module';

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

  const BOOTSTRAP_PROVIDERS: StaticProvider[] = [
    { provide: ServerCommandSubject, useValue: fromServer },
    { provide: BrowserCommandSubject, useValue: fromBrowser }
  ];

  let ref: PlatformRef;
  bootstrapCloudServerDynamic(BOOTSTRAP_PROVIDERS).then(async (_) => {
    ref = _;
    await ref.bootstrapModule(AppModule);
  });

  ws.on('close', () => {
    if (ref) {
      ref.destroy();
      ref = null;
    }

    if (fromServerSubscription) {
      fromServerSubscription.unsubscribe();
    }
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
