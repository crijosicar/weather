import { FormControl } from '@angular/forms';

export class TermsValidator {
    static isValid(control: FormControl): any {

        if (control.value !== true) {
            return {
                "Debe aceptar los terminos y condiciones": true
            };
        }

        return null;
    }
}