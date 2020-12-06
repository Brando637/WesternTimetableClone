import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { AuthenticateService } from './authenticate.service'
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private authService: AuthenticateService, private route: Router) { }

  canActivate(){
    if(this.authService.isAuthenticated())
    {
      return true;
    }
    this.route.navigate(['login']);
    return false;
  }
}
