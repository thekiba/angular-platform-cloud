import { ApplicationRef, DoBootstrap, NgModule } from '@angular/core';
import { CloudBrowserModule } from '@angular/platform-cloud';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CloudBrowserModule,
    BrowserAnimationsModule
  ]
})
export class AppModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef): void {}
}
