import {Component} from '@angular/core';
import {OrchidServices} from '../core/services/OrchidServices';
import {User} from '../core/model/User';
import {Router} from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'login-cmp',
    templateUrl: 'login.component.html'
})

export class LoginComponent {

    public userEmail : string;
    public userPassword : string;
    public errorMsg : string = null;

    constructor(
        private adminService : OrchidServices,
        private router : Router
    ) {}

    authenticate() {
        this.adminService.authenticate(this.userEmail,this.userPassword).subscribe(
            (response) => {
                let user : User = Object.assign(new User(),response);
                if (user.role === 'ADMIN') {
                    this.router.navigate(['/admin']);
                }
                else {
                    this.router.navigate(['/dashboard']);
                }
            },
            (error) => {
                this.showError(error);
            }
        );
    }

    showError(error) {
        this.errorMsg = error.error;
        this.userPassword = null;
        this.userEmail = null;
        setTimeout(() => {
            this.errorMsg = null;
        }, 3000)
    }

    checkLoginForm() {
        return !!this.userEmail && !!this.userPassword;
    }
}
