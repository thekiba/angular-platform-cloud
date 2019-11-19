import { CloudServerModule } from '@angular/platform-cloud';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { MainComponent } from './main.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainComponent
  ],
  imports: [
    CloudServerModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
