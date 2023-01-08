import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './basic/header/header.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreviewComponent } from './preview/preview.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from "@angular/forms"

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PreviewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    // ToDo need to be removed
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
