import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private http:HttpClient) { }

  rootURL = '/api'

  login(data):Observable<any>{
    return this.http.post(this.rootURL + '/user/login',data)
  }
  register(data):Observable<any>{
    return this.http.post(this.rootURL + '/use/register',data)
  }
}
