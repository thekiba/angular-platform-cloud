import { enableProdMode } from '@angular/core';
import { platformCloudBrowserDynamic } from '@angular/platform-cloud-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformCloudBrowserDynamic().bootstrapModule(AppModule, { ngZone: 'noop' })
  .catch(err => console.error(err));
