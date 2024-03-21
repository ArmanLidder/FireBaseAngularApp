import { Component } from '@angular/core';
import {AuthenticationService} from "./services/authentication.service";
import {Router} from "@angular/router";
import {UsersService} from "./services/users.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user$ = this.userService.currentUserProfile$;

  title = 'my-app';
  constructor(public authService: AuthenticationService, private router: Router, private userService: UsersService) {
  }

  logout() {
    this.authService.logout().subscribe(() =>{
      this.router.navigate(['']);
    });
  }

  profile() {
    this.router.navigate(['/profile']);
  }
}
