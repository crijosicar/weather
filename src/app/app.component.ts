import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { RegisterComponent } from '../pages/register/register.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomeComponent } from '../pages/home/home.component';
import { IPage } from '../interfaces/page.interface';
import { LoginComponent } from '../pages/login/login.component';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = LoginComponent;

    pages: Array<IPage>;

    constructor(public platform: Platform, 
        private splashScreen: SplashScreen,
        private statusBar: StatusBar) {
        this.initializeApp();
        this.pages = [
            { title: 'Login', inMenu: false, component: LoginComponent },
            { title: 'Register', inMenu: false, component: RegisterComponent },
            { title: 'Inicio', inMenu: true, component: HomeComponent }
        ];
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(page) {
        this.nav.setRoot(page.component);
    }
    
    logout() {
        console.log("click sobre cerrar sesión.")
    }
}