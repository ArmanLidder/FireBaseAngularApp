import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {HotToastComponent} from "@ngneat/hot-toast/lib/components/hot-toast/hot-toast.component";
import {HotToastService} from "@ngneat/hot-toast";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  })

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private toast: HotToastService
  ) {}

  get email() {
    return this.loginForm.get('email');
  }

  get password(){
    return this.loginForm.get('password');
  }

  ngOnInit() {
  }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }
    const {email, password} = this.loginForm.value;
    this.authService.login(email as string,password as string).pipe(
      this.toast.observe({
        success: 'Logged in succesfully',
        loading: 'Logging in...',
        error: 'There was an error.'
      })
    ).subscribe(()=> {
      this.router.navigate(['/home']);
    })
  }
}
