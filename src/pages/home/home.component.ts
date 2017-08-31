import { Component, ViewChild } from '@angular/core';
import { Nav } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';

@Component({
  selector: 'home',
  templateUrl: 'home.view.html'
})
export class HomeComponent {
    @ViewChild(Nav) nav: Nav;
    authorization: string;

    constructor(private navCtrl: NavController,
        private storage: Storage,
        private network: Network) {
        this.getAuthorization();
    }
    
    getAuthorization(){
        this.storage.get('authorization').then((authorization) => {
            this.authorization = authorization;
            console.log(this.authorization);
        });
    }
}
