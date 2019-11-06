import './polyfills';
import { enableProdMode } from '@angular/core';
import { bootstrapCloudServerDynamic, compileModuleAndAllComponentsAsync } from '@angular/platform-cloud-dynamic';
import { AppModule } from './app/app.module';


// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

bootstrapCloudServerDynamic().then(async (ref) => {
  const moduleFactory = await compileModuleAndAllComponentsAsync(ref, AppModule);
  await ref.bootstrapModuleFactory(moduleFactory.ngModuleFactory);
});
