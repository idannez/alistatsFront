import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './components/units/menu/menu.component';
import { SummonerComponent } from './components/assemblers/summoner/summoner.component';
import { SummonerCardComponent } from './components/units/summoner-card/summoner-card.component';
import { SearchComponent } from './components/assemblers/search/search.component';
import { InputComponent } from './components/units/input/input.component';
import { CreateUserComponent } from './components/units/create-user/create-user.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/units/login/login.component';
import { ModifyUserComponent } from './components/units/modify-user/modify-user.component';
import { FooterComponent } from './components/units/footer/footer.component';
import { AdminComponent } from './components/units/admin/admin.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SummonerComponent,
    SummonerCardComponent,
    SearchComponent,
    InputComponent,
    CreateUserComponent,
    LoginComponent,
    ModifyUserComponent,
    FooterComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
