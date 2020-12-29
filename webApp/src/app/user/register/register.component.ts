import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticateService } from 'src/app/authenticate.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  htmlToAdd:SafeHtml;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthenticateService, private sanitizer: DomSanitizer) { }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.registerForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      fName: new FormControl('', [Validators.required]),
      password2:  new FormControl('', [Validators.required]) 
    });
  }

  /*Upon registering to the website, send the information to the server to create the account
   with the website. If the server responds with a success then tell the user that they need
   to go to their email to go and verify their account*/
  onRegister(): void {
    if(this.registerForm.valid)
    {
      this.authService.register(this.registerForm.value).subscribe(
        (response) => {
          if(response.success == true)
          {
            this.htmlToAdd = '<h2>'+response.msg+'</h2>';
          }

          if(response.success == false)
          {
            this.htmlToAdd = '<h2>'+response.msg+'</h2>';
          }
        },
        (error) => {
          console.log("Error")
        }
      )
    }
  }

}
