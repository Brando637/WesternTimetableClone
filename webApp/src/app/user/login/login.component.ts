import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticateService } from 'src/app/authenticate.service';
import { SafeHtml } from '@angular/platform-browser';
import { HttpCallsService } from 'src/app/http-calls.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  htmlToAdd: SafeHtml;
  public show: Boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthenticateService,  private appService: HttpCallsService) { }

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
          if(response.success == true)
          {
            this.router.navigate(['home-full']);
          }
          if(response.success == false && response.msg == "You have not confirmed your email yet. Would you like to re-send your confirmation email?")
          {
            this.show = !this.show;
            this.htmlToAdd = '<h2>'+response.msg+'</h2>';
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

  resendEmail(): void{
    this.appService.resendEmail(this.loginForm.value).subscribe(
      (response) => {
        if(response.success == true)
        {
          this.htmlToAdd = '<h2>'+response.msg+'</h2>';
        }
        console.log(response);
      }
    )
  }
}
