import './polyfills';
import { enableProdMode } from '@angular/core';

import { bootstrapCloudServerDynamic } from '@angular/platform-cloud-dynamic';
import { AppModule } from './app/app.module';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

bootstrapCloudServerDynamic().then(ref => ref.bootstrapModule(AppModule));
