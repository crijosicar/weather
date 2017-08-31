import { Component, ViewChild } from '@angular/core';
import { 
    FormControl, 
    FormGroup, 
    Validators 
} from '@angular/forms';
import {
    LoadingController,
    Nav,
    NavController,
    ToastController,
    AlertController
} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import { HomeComponent } from '../home/home.component';
import { ILogin } from '../../interfaces/login.interface';
import { IResponseUtil } from '../../interfaces/response-util.interface';
import {
    CLOSE,
    NO_NETWORK_CONNECTION,
    NONE,
    OPS,
    TOP,
    WAIT
} from '../../common/const-messages';
import { LoginService } from './login.service';
import { PasswordRecoveryComponent } from '../password-recovery/password-recovery.component';
import { PATTERN_EMAIL } from '../../common/const-util';
import { RegisterComponent } from '../register/register.component';

@Component({
    selector: 'login',
    templateUrl: 'login.view.html'
})
export class LoginComponent {
    @ViewChild(Nav) nav: Nav;
    loginForm: FormGroup;
    registerComponent: any = RegisterComponent;
    passwordRecoveryComponent: any = PasswordRecoveryComponent;
    loginUserResponse: IResponseUtil;
    loader: any;
    errorMessage: string;
    homeComponent: any = HomeComponent;
    dataForm: ILogin = {
        id: null,
        idPerson: null,
        idUserAccess: null,
        password: null,
        user_name: null
    };

    constructor(private toastCtrl: ToastController,
        private loginService: LoginService,
        private loadingCtrl: LoadingController,
        private navCtrl: NavController,
        private storage: Storage,
        private network: Network,
        private alertCtrl: AlertController,
        private facebook: Facebook) {
        if (this.network.type === NONE) {
            this.makeToast(NO_NETWORK_CONNECTION, TOP);
        }
        this.loginForm = new FormGroup({
            usuario: new FormControl(null, Validators.compose([
                Validators.pattern(PATTERN_EMAIL),
                Validators.required
            ])),
            contrasenia: new FormControl(null, Validators.required)
        });
    }

    presentLoading() {
        this.loader = this.loadingCtrl.create({
            content: WAIT
        });
        this.loader.present();
    }
    
    loginConFB(){
        this.facebook.login(['public_profile', 'user_friends', 'email'])
        .then((res: FacebookLoginResponse) => {
            console.log('Logged into Facebook!', res);
        })
        .catch((e) => {
            console.log('Error logging into Facebook', e);
        });
    }

    makeToast(message: string, position: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 6000,
            position: position,
            showCloseButton: true,
            closeButtonText: CLOSE,
            dismissOnPageChange: false
        });
        toast.present();
    }

    sendForm() {
        if(!this.loginForm.valid){
            let alert = this.alertCtrl.create({
                title: 'Error!',
                subTitle: 'Favor revisar los campos del formulario!',
                buttons: ['OK']
            });
            alert.present();
        } else {
            this.presentLoading();
            if (this.network.type === NONE) {
                this.loader.dismiss();
                this.makeToast(NO_NETWORK_CONNECTION, TOP);
            } else {
                this.dataForm.password = this.loginForm.value.contrasenia;
                this.dataForm.user_name = this.loginForm.value.usuario;
                this.loginService.loginUser(this.dataForm).subscribe(
                    loginUserResponse => {
                        this.loader.dismiss();
                        this.loginUserResponse = loginUserResponse;
                        if (this.loginUserResponse.tipo !== 200) {
                            this.makeToast(this.loginUserResponse.message, TOP);
                        } else {
                            this.storage.set('authorization', this.loginUserResponse.token);
                            this.navCtrl.setRoot(this.homeComponent);
                        }
                    },
                    error => {
                        this.loader.dismiss();
                        this.errorMessage = <any>error
                        this.makeToast(OPS, TOP);
                    }
                );
            }
        }
    }
}