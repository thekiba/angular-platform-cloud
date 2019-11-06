import { ApplicationRef, DoBootstrap, NgModule } from '@angular/core';
import { CloudBrowserModule } from '@angular/platform-cloud';

@NgModule({
  imports: [
    CloudBrowserModule
  ]
})
export class AppModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef): void {}
}
