import { CloudServerModule, CloudServerAnimationsModule } from '@angular/platform-cloud';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main/main.component';
import { ButtonComponent } from './button/button.component';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainComponent,
    ButtonComponent,
    LayoutComponent
  ],
  imports: [
    CloudServerModule,
    CloudServerAnimationsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
