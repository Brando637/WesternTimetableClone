import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticateService } from 'src/app/authenticate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  email= new FormControl('', [Validators.required, Validators.email]);
  password= new FormControl('', [Validators.required]);

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthenticateService) { }

  getErrorMessageEmail() {
    if(this.email.hasError('required'))
    {
      return "You must enter a value";
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getErrorMessage() {
    if(this.password.hasError('required'))
    {
      return "You must enter a value";
    }
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.loginForm = this.fb.group({

    });
  }

  onLogin(): void {
    if(this.loginForm.valid)
    {
      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          if(response.success)
          {

          }
        }
      )
    }
    }
}
