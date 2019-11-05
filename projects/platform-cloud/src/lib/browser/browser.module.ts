import { CommonModule } from '@angular/common';
import { ApplicationModule, NgModule } from '@angular/core';

@NgModule({
  exports: [
    ApplicationModule,
    CommonModule
  ]
})
export class CloudBrowserModule {}
