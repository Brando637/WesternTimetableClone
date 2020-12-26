import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpCallsService } from '../http-calls.service';
import { AuthenticateService } from '../authenticate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-full',
  templateUrl: './home-full.component.html',
  styleUrls: ['./home-full.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeFullComponent implements OnInit {

  deleteScheduleForm: FormGroup;
  searchCourseForm: FormGroup;
  searchCourseFormKey: FormGroup;
  createSchedule: FormGroup;

  htmlToAdd:SafeHtml;
  htmlToAddFull:SafeHtml;
  responseHolder: object;
  enable = new FormControl();
  public limited: boolean = true;
  public full: boolean = false;

  onChange(ob: MatSlideToggleChange){
    console.log(ob.checked);
    if(ob.checked==true)
    {
      this.expand();
    }
    if(ob.checked==false)
    {
      this.collapse();
    }
  }

  constructor(private fb: FormBuilder, private appService: HttpCallsService, private sanitizer: DomSanitizer, private authService: AuthenticateService, private route: Router) {}

  public hasError = (controlName: string, errorName: string) => {
    return this.createSchedule.controls[controlName].hasError(errorName);
  }

  public hasErrorKey = (controlName: string, errorName: string) => {
    return this.searchCourseFormKey.controls[controlName].hasError(errorName);
  }
  ngOnInit(): void {
    this.initializeForm();
  }

  logout(): void {
    this.authService.logout().subscribe(
      success => {
        if(success)
        {
          this.route.navigate(['/login']);
        }
      }
    )
  }

  initializeForm(): void {
    this.searchCourseForm = this.fb.group({
      subject:"",
      courseNumber:""
    });
    this.searchCourseFormKey = this.fb.group({
      keyword: new FormControl( '', [Validators.minLength(4)] )
    });
    this.deleteScheduleForm = this.fb.group({
      deleteSchedule:"",
      userID: ""
    });
    this.createSchedule = this.fb.group({
      scheduleName: new FormControl('', [Validators.required]),
      description:"",
      visibility:"",
      userID: "",
    })
  }

  confirmDialog(): void{
    
  }

  expand(): void {
    this.limited = false;
    this.full = true;
  }
  collapse(): void{
    this.limited = true;
    this.full = false;
  }

  onSubmitSchedule(): void {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.createSchedule.value.userID = userInfo.user;
    console.log(this.createSchedule.value)
    this.appService.createSchedule(this.createSchedule.value, this.createSchedule.value.scheduleName).subscribe(
      (response) => {},
      (error) => {}
    );
  }

  onDeleteSchedule(): void {
    console.log(this.deleteScheduleForm.value);
    let userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.deleteScheduleForm.value.userID = userInfo.user;
    this.appService.deleteSchedule(this.deleteScheduleForm.value.deleteSchedule).subscribe(
      (response) => {
        console.log("The response from the server is " + response)
        this.htmlToAdd = '<h2>'+response.toString()+'</h2>';
        this.htmlToAddFull = '<h2>'+response.toString()+'</h2>';
      },
      (error) => console.log("The error returned from the server is" + error)
    );
  }

  onSubmitCourse(): void {
    console.log(this.searchCourseForm);
    console.log(this.searchCourseForm.value);
    this.appService.searchCourse(this.searchCourseForm.value).subscribe(
      (response) => {
        var attachHTML = "";
        attachHTML = this.parseResultLimited(response);
        this.htmlToAdd = this.sanitizer.bypassSecurityTrustHtml("<ul class=scheduleList>" + attachHTML + '</ul>');
        attachHTML = this.parseResultFull(response);
        this.htmlToAddFull = this.sanitizer.bypassSecurityTrustHtml("<ul class=scheduleList>" + attachHTML + '</ul>');
      },
      (error) => console.log("The error returned from the server is" + error)
    );
  }


  onSubmitKey(): void{
    if(this.searchCourseFormKey.valid)
    {
      this.appService.searchCourseKeyword(this.searchCourseFormKey.value).subscribe(
        (response) =>{
          var attachHTML = "";
          attachHTML = this.parseResultLimited(response);
          this.htmlToAdd = this.sanitizer.bypassSecurityTrustHtml("<ul class=scheduleList>" + attachHTML + '</ul>');
          attachHTML = this.parseResultFull(response);
          this.htmlToAddFull = this.sanitizer.bypassSecurityTrustHtml("<ul class=scheduleList>" + attachHTML + '</ul>');
        },
        (error) => {console.log("The error return from the server is" + error)}
      );
    }
  }

  onPublicSchedules(): void{
    this.appService.getSchedules().subscribe(
      (response) => {

      },
      (error) => {}
    );
  }

  parseResultLimited(response): string{
    var attachHTML = ""

    if (response.includes("Sorry")) 
    {
      this.htmlToAdd = response;
    }
    else 
    {
      for (let x in response) 
      {
        console.log(response[x]);
        attachHTML += '<h2>' + response[x].subject + ' - ' + response[x].className + ' ' + response[x].catalog_nbr + '</h2>';
        attachHTML += '<div class=descrip>' + response[x].catalog_description + '</div>';
        attachHTML += '<div' + response[x].course_info[0].ssr_component + '>' + response[x].course_info[0].ssr_component + '</div>';
      }
    }
    return attachHTML;
  }

  parseResultFull(response): string {
    var attachHTML = ""

    if (response.includes("Sorry"))
        {
          this.htmlToAdd = response;
        }
        else
        {
          for (let x in response)
          {
            attachHTML += '<h2>' + response[x].subject + '' + response[x].catalog_nbr + ' - ' + response[x].className +  '</h2>';
            attachHTML += '<div> Course Description: ' + response[x].catalog_description + '<div class=grid-container><div>Section</div><div>Component</div><div>Class Nbr</div><div>Days</div><div>Start Time</div><div>End Time</div><div>Location</div><div>Instructor</div><div>Requisites and Constraints</div><div>Status</div><div>Campus</div><div>Extra Info</div>';
            attachHTML += '<div>'+response[x].course_info[0].class_section+'</div>' + '<div>'+response[x].course_info[0].ssr_component+'</div>' + '<div>'+response[x].course_info[0].class_nbr+'</div>'+'<div>'+response[x].course_info[0].days+'</div>'+'<div>'+response[x].course_info[0].start_time+'</div>'+'<div>'+response[x].course_info[0].end_time+'</div>'+'<div>'+response[x].course_info[0].facility_ID+'</div>'+'<div>'+response[x].course_info[0].instructors+'</div>'+'<div>'+response[x].course_info[0].descrlong+'</div>'+'<div>'+response[x].course_info[0].enrl_stat+'</div>'+'<div>'+response[x].course_info[0].campus+'</div>'+'<div>'+response[x].course_info[0].descr+'</div></div>';
          }
          attachHTML += '</div>';
        }
    return attachHTML;
  }
}
