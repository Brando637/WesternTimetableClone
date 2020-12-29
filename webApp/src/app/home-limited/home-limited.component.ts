import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpCallsService } from '../http-calls.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-limited',
  templateUrl: './home-limited.component.html',
  styleUrls: ['./home-limited.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeLimitedComponent implements OnInit {

  searchCourseForm: FormGroup;
  searchCourseFormKey: FormGroup;

  htmlToAdd:SafeHtml;
  htmlToAddFull:SafeHtml;
  htmlSchedule:SafeHtml;
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


  constructor(private fb: FormBuilder, private appService: HttpCallsService, private sanitizer: DomSanitizer, private route: Router) {}

  /*hasError is used to detect errors that are made
    to the form controller that it is attached to. If the error
    occurs then the error is shown to the user*/
  public hasError = (controlName: string, errorName: string) => {
    return this.searchCourseFormKey.controls[controlName].hasError(errorName);
  }
  ngOnInit(): void {
    this.initializeForm();
    this.onPublicSchedules();
  }

  initializeForm(): void {
    this.searchCourseForm = this.fb.group({
      subject:"",
      courseNumber:""
    });
    this.searchCourseFormKey = this.fb.group({
      keyword: new FormControl( '', [Validators.minLength(4)] )
    });
  }
  //If the user wants to register an account with the website to get full access to all the functions then it will be redirected to the register page
  register(): void{
    this.route.navigate(['/register']);
  }

  expand(): void {
    this.limited = false;
    this.full = true;
  }
  collapse(): void{
    this.limited = true;
    this.full = false;
  }

  //Search for the course based on catalog_nbr or className
  onSubmitCourse(): void {
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

  //Search the course based on a keyword that is at least a length of 4 characters long.
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

  //Retrieve the schedules that are listed as public and display them to the user
  onPublicSchedules(): void{
    this.appService.getSchedules().subscribe(
      (response) => {
        console.log(response);
        var attachHTML = "";
        attachHTML = this.parseResultSchedulePublic(response);
        this.htmlSchedule = this.sanitizer.bypassSecurityTrustHtml("<ul>" + attachHTML + '</ul>');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //Parse through response from the server and create the list of public schedules that will be displayed
  parseResultSchedulePublic(response): string{
    var attachHTML = "";

    attachHTML += '<div class=grid-containerSchedule><div>Schedule</div><div>Username</div><div>Courses</div><div>Last Modified</div>';

    for (let x in response )
    {
      let numCourses = response[x].listOfSchedule.length
      attachHTML += '<div>' + response[x].schedule + '</div><div>' + response[x].fName + '</div><div>' + numCourses.toString() + '</div><div>' + response[x].lastModDate + '</div>';
    }
    attachHTML +='</div>';
    return attachHTML;
  }

  //Parse the limited version of the response from the server when the user searches for a course
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

  //Parse the full version of the response from the server when the user searches for a course
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
            attachHTML += '<h3>Reviews</h3>';
            attachHTML += '<div class=grid-containerReview><div>Name</div><div>Time</div><div>Review</div>';

            for ( let y in response[x].review )
            {
              console.log(response[x].review[y]);
              attachHTML += '<div>' + response[x].review[y].fName + '</div><div>' + response[x].review[y].timeModified + '</div><div>' + response[x].review[y].reviewDescrip + '</div>';
            }
            attachHTML += '</div>'
          }
          attachHTML += '</div>';
        }
    return attachHTML;
  }
}
