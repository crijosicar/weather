import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { HeaderColor } from '@ionic-native/header-color';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Facebook } from '@ionic-native/facebook';

import { MyApp } from './app.component';
import { LoginComponent } from '../pages/login/login.component';
import { RegisterComponent } from '../pages/register/register.component';
import { HomeComponent } from '../pages/home/home.component';
import { PasswordRecoveryComponent } from '../pages/password-recovery/password-recovery.component';
import { RegisterService } from '../pages/register/register.service';
import { LoginService } from '../pages/login/login.service';
import { PasswordRecoveryService } from '../pages/password-recovery/password-recovery.service';
import { CapitalizePipe } from '../pipes/capitalize.pipe';

@NgModule({
    declarations: [
      MyApp,
      LoginComponent,
      RegisterComponent,
      HomeComponent,
      PasswordRecoveryComponent,
      CapitalizePipe
    ],
    imports: [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({
            name: '__weatherdb',
            driverOrder: ['sqlite', 'indexeddb', 'websql']
        })
    ],
    bootstrap: [ IonicApp ],
    entryComponents: [
      MyApp,
      LoginComponent,
      RegisterComponent,
      HomeComponent,
      PasswordRecoveryComponent
    ],
    providers: [
        Camera,
        Geolocation,
        SplashScreen,
        StatusBar,
        Network,
        HeaderColor,
        Diagnostic,
        Facebook,
        RegisterService, 
        LoginService,
        PasswordRecoveryService,
        { provide : ErrorHandler, useClass : IonicErrorHandler}
    ]
})
export class AppModule {}
