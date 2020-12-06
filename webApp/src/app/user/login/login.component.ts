import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticateService } from 'src/app/authenticate.service';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  htmlToAdd: SafeHtml;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthenticateService) { }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required])
    });
  }

  onLogin(): void {
    if(this.loginForm.valid)
    {
      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          if(response.success)
          {
            this.authService.setUserInfo({'user' : response['user']});
            this.router.navigate(['home-full']);
          }
          else
          {
            this.htmlToAdd = '<h2>'+response.msg +'</h2>' 
          }

        },
        (error) => {
          console.log(error)
        }
      )
    }
    }
}
