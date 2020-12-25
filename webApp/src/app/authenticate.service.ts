import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { Tokens } from '../app/tokens';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser: string;

  constructor(private http:HttpClient) { }

  rootURL = '/api'

  // public isLoggedIn(): Boolean {
  //   let userData = localStorage.getItem('userInfo')
  //   if(userData && JSON.parse(userData))
  //   {return true;}
  //   else{return false;}
  // }
  // public setUserInfo(user){
  //   localStorage.setItem('userInfo', JSON.stringify(user));
  // }


  login(data):Observable<any>{
    return this.http.post<any>(this.rootURL + '/user/login',data)
    .pipe(
      tap(tokens => this.doLoginUser(data.email, tokens)),
      catchError(error => {
        alert(error.error);
        return of(false);
      })
    );
  }

  logout() {
    return this.http.post<any>(this.rootURL + '/user/logout', {
      'refreshToken': this.getRefreshToken()
    }).pipe(
      tap(() => this.doLogoutUser()),
      mapTo(true),
      catchError(error => {
        alert( error.error );
        return of(false);
      })
    );
  }

  isLoggedIn()
  {
    return !!this.getJwtToken();
  }

  refreshToken()
  {
    return this.http.post<any>(this.rootURL + '/user/refresh', {
      'refreshToken': this.getRefreshToken()
    }).pipe(tap(( tokens: Tokens) => {
      this.storeJwtToken(tokens.jwt);
    }));
  }

  getJwtToken()
  {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  register(theForm):Observable<any>{
    return this.http.post(this.rootURL + '/user/signup', theForm)
  }

  private doLoginUser( email: string, tokens: Tokens)
  {
    this.loggedUser = email;
    this.storeTokens(tokens);
  }

  private doLogoutUser()
  {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken()
  {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string)
  {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: Tokens)
  {
    localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
    localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  }

  private removeTokens()
  {
    localStorage. removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }
}
