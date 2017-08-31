import { FormGroup, AbstractControl } from '@angular/forms';

export class MatchPasswordValidator {
    static isMatchPassword(passwordKey = 'password', confirmPasswordKey = 'confirmPassword'): any {
        return (AC:  FormGroup): {[key: string]: any} => {
            let password = AC.controls[passwordKey];
            let confirmPassword = AC.controls[confirmPasswordKey];
            /*let password = c.get(passwordKey);
            let confirmPassword = c.get(confirmPasswordKey);*/

            if (password.value !== confirmPassword.value) {
                  return {
                    isMatchPassword : true
                };
            } else {
                return null;
            }
        }
    }
    
}
