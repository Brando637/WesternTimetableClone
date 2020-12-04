import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  
  //FormControls to check that a value has been entered into each field of the form
  email= new FormControl('', [Validators.required, Validators.email]);
  password= new FormControl('', [Validators.required]);
  fName= new FormControl('', [Validators.required]);
  lName= new FormControl('', [Validators.required]);

  constructor(private fb: FormBuilder, private router: Router) { }

  getErrorMessageEmail() {
    if(this.email.hasError('required'))
    {
      return "You must enter a value";
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getErrorMessage(){
    if(this.password.hasError('required'))
    {
      return "You must enter a value";
    }
    if(this.fName.hasError('required'))
    {
      return "You must enter a value;"
    }
    if(this.lName.hasError('required'))
    {
      return "You must enter a value;"
    }
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.registerForm = this.fb.group({

    });
  }

  onRegister(): void {

  }

}
