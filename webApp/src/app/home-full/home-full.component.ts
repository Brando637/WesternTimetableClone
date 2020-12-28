import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpCallsService } from '../http-calls.service';
import { AuthenticateService } from '../authenticate.service';
import { Router } from '@angular/router';
import { DialogService } from './mat-confirm-dialog/dialog.service';

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
  htmlSchedule:SafeHtml;
  htmlSchedulePub: SafeHtml;
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

  constructor(private fb: FormBuilder, private appService: HttpCallsService, private sanitizer: DomSanitizer, private authService: AuthenticateService, private route: Router, private dialogService: DialogService) {}

  public hasError = (controlName: string, errorName: string) => {
    return this.createSchedule.controls[controlName].hasError(errorName);
  }

  public hasErrorKey = (controlName: string, errorName: string) => {
    return this.searchCourseFormKey.controls[controlName].hasError(errorName);
  }
  ngOnInit(): void {
    this.initializeForm();

    this.appService.getSchedulesPrivate().subscribe(
      (response) => {
        var attachHTML = "";
        attachHTML = this.parseResultSchedule(response);
        this.htmlSchedule = this.sanitizer.bypassSecurityTrustHtml("<ul>" + attachHTML + '</ul>');

      },
      (error) => console.log(error)
    );
    this.onPublicSchedules();

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
      deleteSchedule:""
    });
    this.createSchedule = this.fb.group({
      scheduleName: new FormControl('', [Validators.required]),
      description:"",
      visibility:""
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
    console.log(this.createSchedule.value)
    this.appService.createSchedule(this.createSchedule.value, this.createSchedule.value.scheduleName).subscribe(
      (response) => {
        if(response.success == true)
        {
          this.appService.getSchedulesPrivate().subscribe(
            (innerResponse) => {
              var attachHTML = "";
              attachHTML = this.parseResultSchedule(innerResponse);
              this.htmlSchedule = this.sanitizer.bypassSecurityTrustHtml("<ul>" + attachHTML + '</ul>');
      
            },
            (error) => console.log(error)
          );
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onDeleteSchedule(): void {
    console.log(this.deleteScheduleForm.value);

    this.dialogService.openConfirmDialog("Are you sure you want to delete this schedule?")
    .afterClosed().subscribe( response => {
      if(response == true)
      {
        this.appService.deleteSchedule(this.deleteScheduleForm.value.deleteSchedule).subscribe(
          (response) => {
            console.log("The response from the server is " + response)
            this.htmlToAdd = '<h2>'+response.toString()+'</h2>';
            this.htmlToAddFull = '<h2>'+response.toString()+'</h2>';
          },
          (error) => console.log("The error returned from the server is" + error)
        );

        this.appService.getSchedulesPrivate().subscribe(
          (response) => {
            var attachHTML = "";
            attachHTML = this.parseResultSchedule(response);
            this.htmlSchedule = this.sanitizer.bypassSecurityTrustHtml("<ul>" + attachHTML + '</ul>');
    
          },
          (error) => console.log(error)
        );
      }
    });

    
  }

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
        console.log(response);
        var attachHTML = "";
        attachHTML = this.parseResultSchedulePublic(response);
        this.htmlSchedulePub = this.sanitizer.bypassSecurityTrustHtml("<ul>" + attachHTML + '</ul>');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  parseResultSchedule(response): string{
    var attachHTML = "";

    attachHTML += '<div class=grid-containerSchedule><div>Schedule</div><div>Courses</div><div>Description</div><div>Status</div><div>Last Modified</div>';

    for (let x in response )
    {
      attachHTML += '<div>' + response[x].schedule + '</div><div>' + response[x].listOfSchedule + '</div><div>' + response[x].description + '</div><div>' + response[x].status + '</div><div>' + response[x].lastModDate + '</div>';
    }
    attachHTML +='</div>';
    return attachHTML;
  }
  parseResultSchedulePublic(response): string{
    var attachHTML = "";

    attachHTML += '<div class=grid-containerSchedulePub><div>Schedule</div><div>Username</div><div>Courses</div><div>Last Modified</div>';

    for (let x in response )
    {
      let numCourses = response[x].listOfSchedule.length
      attachHTML += '<div>' + response[x].schedule + '</div><div>' + response[x].fName + '</div><div>' + numCourses.toString() + '</div><div>' + response[x].lastModDate + '</div>';
    }
    attachHTML +='</div>';
    return attachHTML;
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
