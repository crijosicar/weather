import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
    LoadingController,
    Nav,
    NavController,
    ToastController,
    AlertController
} from 'ionic-angular';

import {
    CLOSE,
    NO_NETWORK_CONNECTION,
    NONE,
    OPS,
    TOP,
    WAIT
} from '../../common/const-messages';
import { LoginComponent } from '../login/login.component';
import { Network } from '@ionic-native/network';
import { PasswordRecoveryService } from './password-recovery.service';
import { PATTERN_EMAIL } from '../../common/const-util';
import { IPasswordRecovery } from '../../interfaces/password-recovery.interface';
import { IResponseUtil } from '../../interfaces/response-util.interface';

@Component({
    selector: 'password-recovery',
    templateUrl: 'password-recovery.view.html'
})
export class PasswordRecoveryComponent {
    @ViewChild(Nav) nav: Nav;
    passwordRecoveryForm: FormGroup;
    loginComponent: any = LoginComponent;
    loader: any;
    errorMessage: string;
    dataForm: IPasswordRecovery = {
        email: null
    };
    updatePasswordResponse: IResponseUtil;

    constructor(private toastCtrl: ToastController,
        private passwordRecoveryService: PasswordRecoveryService,
        private loadingCtrl: LoadingController,
        private navCtrl: NavController,
        private network: Network,
        private alertCtrl: AlertController) {
        this.passwordRecoveryForm = new FormGroup({
            email: new FormControl(null, Validators.compose([
                Validators.pattern(PATTERN_EMAIL),
                Validators.required
            ]))
        });
    }

    presentLoading() {
        this.loader = this.loadingCtrl.create({
            content: WAIT
        });
        this.loader.present();
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
        if(!this.passwordRecoveryForm.valid){
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
                this.dataForm.email = this.passwordRecoveryForm.value.email;
                this.passwordRecoveryService.updatePasswordByMail(this.dataForm).subscribe(
                    updatePasswordResponse => {
                        this.loader.dismiss();
                        this.updatePasswordResponse = updatePasswordResponse;
                        if (this.updatePasswordResponse.tipo !== 200) {
                            this.makeToast(this.updatePasswordResponse.message, TOP);
                        } else {
                            this.makeToast(this.updatePasswordResponse.message, TOP);
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
