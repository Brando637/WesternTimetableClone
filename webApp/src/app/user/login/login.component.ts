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

  /*Upon clicking the login button send the login form to the server 
    Once a response is received determine if the login was a success.
    If the login was a success then navigate the user to the full website page.
    If there was some kind of error then notify the user of the error and do
    the appropriate action*/
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
            //Display to the user the option to resend an email to confirm their email
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

  //If the response from the server found that they have not confirmed their email then call this funtion
  //to make a call to the server to have it resend the email to the user
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
