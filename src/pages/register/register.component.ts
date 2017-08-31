import {
    AlertController,
    LoadingController,
    Nav,
    NavController,
    ToastController
} from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { HeaderColor } from '@ionic-native/header-color';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Storage } from '@ionic/storage';

import { HomeComponent } from '../home/home.component';
import { ILogin } from '../../interfaces/login.interface';
import { IResponseUtil } from '../../interfaces/response-util.interface';
import { LoginComponent } from '../login/login.component';
import { LoginService } from '../login/login.service';
import {
    MONTHS_SHORT_NAMES,
    PATTERN_EMAIL,
    PATTERN_PASSWORD,
    PHONE_NUMBER
} from '../../common/const-util';
import { RegisterService } from './register.service';
import { TermsValidator } from '../../common/validators/termsValidator';
import { MatchPasswordValidator } from '../../common/validators/matchPassValidator';

import * as moment from 'moment';
import {
    ACCEPT,
    CLOSE,
    NO_NETWORK_CONNECTION,
    NONE,
    OPS,
    TOP,
    WAIT,
    OK
} from '../../common/const-messages';

@Component({
    selector: 'register',
    templateUrl: 'register.view.html'
})
export class RegisterComponent {
    termsAgree: boolean;
    errorMessage: string;
    monthNames = MONTHS_SHORT_NAMES;
    saveNewResponse: IResponseUtil;
    loginUserResponse: IResponseUtil;
    listCities: Array<Object>;
    listCitiesBorn: Array<Object>;
    listGeneros: Array<Object>;
    registerForm: FormGroup;
    loader: any;
    @ViewChild(Nav) nav: Nav;
    dataForm: ILogin = {
        id: null,
        idPerson: null,
        idUserAccess: null,
        password: null,
        user_name: null,
        terms: null
    };
    homeComponent: any = HomeComponent;
    loginComponent: any = LoginComponent;

    constructor(private registerService: RegisterService,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private loginService: LoginService,
        private navCtrl: NavController,
        private network: Network,
        private headerColor: HeaderColor,
        private geolocation: Geolocation,
        private diagnostic: Diagnostic,
        private storage: Storage,
        private formBuilder: FormBuilder) {
        this.getAllCities();
        this.getAllGenders();
        this.termsAgree = false;
        this.registerForm = formBuilder.group({
            id: new FormControl(null),
            name: new FormControl(null, Validators.required),
            lastname: new FormControl(null, Validators.required),
            email: new FormControl(null, Validators.compose([
                Validators.pattern(PATTERN_EMAIL),
                Validators.required
            ])),
            phone: new FormControl(null, Validators.compose([
                Validators.pattern(PHONE_NUMBER),
                Validators.required
            ])),
            birthDate: new FormControl(null, Validators.required),
            actualCity: new FormControl(null, Validators.required),
            idBornCity: new FormControl(null, Validators.required),
            idState: new FormControl(40),
            idGender: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.compose([
                Validators.minLength(6),
                Validators.pattern(PATTERN_PASSWORD),
                Validators.required
            ])),
            confirmPassword: new FormControl(null),
            termsAgree: new FormControl(false, Validators.compose([
                Validators.required,
                TermsValidator.isValid
            ]))
        } , {validator: isMatchPassword('password', 'confirmPassword')});
        
        this.headerColor.tint('#becb29');
        
        function isMatchPassword(passwordKey: string, confirmPasswordKey: string) {
            return (AC:  FormGroup): {[key: string]: any} => {
                let password = AC.controls[passwordKey];
                let confirmPassword = AC.controls[confirmPasswordKey];
                if (password.value !== confirmPassword.value) {
                      return {
                        isMatchPassword: true
                    };
                } else {
                    return null;
                }
            }
        }
    }
   

    getAllCities() {
        this.registerService.getAllCities()
            .subscribe(
            listResponse => {
                if (listResponse.tipo === 200) {
                    this.listCities = listResponse.responseList;
                    this.listCitiesBorn = listResponse.responseList;
                } else {
                    this.listCities = new Array();
                    this.listCitiesBorn = new Array();
                }
            },
            error => {
                this.errorMessage = <any>error
                this.loader.dismiss();
                this.makeToast(OPS, TOP);
            });
    }

    getAllGenders() {
        this.registerService.getAllGenders()
            .subscribe(
            listGeneros => {
                if (listGeneros.tipo === 200) {
                    this.listGeneros = listGeneros.responseList;
                } else {
                    this.listGeneros = new Array();
                }
            },
            error => {
                this.errorMessage = <any>error
                this.loader.dismiss();
                this.makeToast(OPS, TOP);
            });
    }

    getGeolocalization() {
        this.presentLoading();
        if (this.network.type === NONE) {
            this.loader.dismiss();
            let alert = this.alertCtrl.create({
                title: 'Ops!',
                subTitle: NO_NETWORK_CONNECTION,
                buttons: [ACCEPT]
            });
            alert.present();
        } else {
            this.diagnostic.isLocationAvailable().then((isAvaliable) => {
                this.geolocation.getCurrentPosition().then((resp) => {
                    this.registerService.getCityNameByLatLon(`${resp.coords.latitude}`, `${resp.coords.longitude}`).subscribe(
                    ( locationData ) => {
                        if (locationData.status === OK) {
                            this.setGeoLocaledCity(locationData.results);
                        }
                    },
                    error => {
                        this.errorMessage = <any>error
                        this.loader.dismiss();
                        this.makeToast(OPS, TOP);
                    });
                }).catch((error) => {
                    this.loader.dismiss();
                    console.log(error);
                });
            }).catch((err) => {
                this.loader.dismiss();
                console.log(err);
            });
        }
    }
    
    setGeoLocaledCity(results){
        let city = null;
        for (let i = 0; i<results[0].address_components.length; i++) {
            for (let b = 0; b<results[0].address_components[i].types.length; b++) {
            //there are different types that might hold a city admin_area_lvl_1 usually does 
            //in come cases looking for sublocality type will be more appropriate
                if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                    //this is the object you are looking for
                    city = results[0].address_components[i];
                    break;
                }
            }
        }
        this.registerService.getCityByCityname({ cityName: city.long_name })
        .subscribe(( cityID ) => {
            if(cityID.tipo === 200){
                this.registerForm.patchValue({
                    actualCity: cityID.responseList[0]['id']
                });
            }
            this.loader.dismiss();
        },
        ( error ) => {
            this.errorMessage = <any>error
            this.loader.dismiss();
            this.makeToast(OPS, TOP);
        });
        
    }

    showAlert(message: any) {
        let alert = this.alertCtrl.create({
            title: 'Info',
            subTitle: message,
            buttons: [ACCEPT]
        });
        alert.present();
    }

    sendForm() {
        if(!this.registerForm.valid){
            let alert = this.alertCtrl.create({
                title: 'Error!',
                subTitle: 'Favor revisar los campos del formulario!',
                buttons: [ACCEPT]
            });
            alert.present();
        } else {
            this.presentLoading();
            let formData = this.registerForm.value;
            this.dataForm.password = formData.password;
            this.dataForm.user_name = formData.email;
            this.dataForm.terms = formData.termsAgree;
            let year = formData.birthDate.substring(0, 4);
            let month = formData.birthDate.substring(5, 7);
            let day = formData.birthDate.substring(9, 10);
            formData.birthDate = moment(`${year}-${month}-${day}`).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
            let formRegister = {
                "birth_date": formData.birthDate,
                "email": formData.email,
                "id": formData.id,
                "id_born_city": Number(formData.idBornCity),
                "id_gender": Number(formData.idGender),
                "id_state": formData.idState,
                "last_name": formData.lastname,
                "list_frecuent_city": [Number(formData.actualCity)],
                "name": formData.name,
                "phone": formData.phone,
                "userDTO": this.dataForm
            };
            this.registerService.registerNewUser(formRegister).subscribe(
                saveNewResponse => {
                    this.loader.dismiss();
                    this.saveNewResponse = saveNewResponse;
                    if (this.saveNewResponse.tipo !== 200) {
                        this.makeToast(this.saveNewResponse.message, TOP);
                    } else {
                        this.loginAfterRegister(this.saveNewResponse.token);
                    }
                },
                error => {
                    this.errorMessage = <any>error
                    this.loader.dismiss();
                    this.makeToast(OPS, TOP);
                }
            );
        }
    }

    loginAfterRegister(token) {
        this.presentLoading();
        if (this.network.type === NONE) {
            this.loader.dismiss();
            this.makeToast(NO_NETWORK_CONNECTION, TOP);
        } else {
            this.storage.set('authorization', token);
            this.loader.dismiss();
            this.navCtrl.setRoot(this.homeComponent);
        }
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
}