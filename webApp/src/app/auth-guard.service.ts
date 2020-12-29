import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { AuthenticateService } from './authenticate.service'
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthenticateService, private route: Router) { }

  //Used to validate if a user can access certains routes on the website
  canActivate():boolean {
    if(this.authService.isLoggedIn())
    {
      this.route.navigate(['/home-full']);
      return true;
    }
    else
    {
      this.route.navigate(['/login']);
      return false;
    }
  }
}
