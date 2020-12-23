import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private http:HttpClient) { }

  rootURL = '/api'

  public isAuthenticated(): Boolean {
    let userData = localStorage.getItem('userInfo')
    if(userData && JSON.parse(userData))
    {return true;}
    else{return false;}
  }
  public setUserInfo(user){
    localStorage.setItem('userInfo', JSON.stringify(user));
  }


  login(data):Observable<any>{
    return this.http.post(this.rootURL + '/user/login',data)
  }
  register(theForm):Observable<any>{
    return this.http.post(this.rootURL + '/user/signup', theForm)
  }
}
