import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpCallsService } from '../http-calls.service';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-home-limited',
  templateUrl: './home-limited.component.html',
  styleUrls: ['./home-limited.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeLimitedComponent implements OnInit {

  searchCourseForm: FormGroup;
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


  constructor(private fb: FormBuilder, private appService: HttpCallsService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.searchCourseForm = this.fb.group({
      subject:"",
      courseNumber:""
    });
  }

  expand(): void {
    console.log("it works expand");
    this.limited = false;
    this.full = true;
  }
  collapse(): void{
    console.log("it works collapse");
    this.limited = true;
    this.full = false;
  }

  onSubmitCourse(): void {
    console.log(this.searchCourseForm);
    console.log(this.searchCourseForm.value);
    this.appService.searchCourse(this.searchCourseForm.value).subscribe(
      (response) => {
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
          this.htmlToAdd = this.sanitizer.bypassSecurityTrustHtml("<ul class=scheduleList>" + attachHTML + '</ul>');
          attachHTML = "";

          for (let x in response)
          {
            attachHTML += '<h2>' + response[x].subject + '' + response[x].catalog_nbr + ' - ' + response[x].className +  '</h2>';
            attachHTML += '<div> Course Description: ' + response[x].catalog_description + '<div class=grid-container><div>Section</div><div>Component</div><div>Class Nbr</div><div>Days</div><div>Start Time</div><div>End Time</div><div>Location</div><div>Instructor</div><div>Requisites and Constraints</div><div>Status</div><div>Campus</div><div>Extra Info</div>';
            attachHTML += '<div>'+response[x].course_info[0].class_section+'</div>' + '<div>'+response[x].course_info[0].ssr_component+'</div>' + '<div>'+response[x].course_info[0].class_nbr+'</div>'+'<div>'+response[x].course_info[0].days+'</div>'+'<div>'+response[x].course_info[0].start_time+'</div>'+'<div>'+response[x].course_info[0].end_time+'</div>'+'<div>'+response[x].course_info[0].facility_ID+'</div>'+'<div>'+response[x].course_info[0].instructors+'</div>'+'<div>'+response[x].course_info[0].descrlong+'</div>'+'<div>'+response[x].course_info[0].enrl_stat+'</div>'+'<div>'+response[x].course_info[0].campus+'</div>'+'<div>'+response[x].course_info[0].descr+'</div></div>';
          }
          attachHTML += '</div>';
          console.log("The response from the server is " + response);
          this.htmlToAddFull = this.sanitizer.bypassSecurityTrustHtml("<ul class=scheduleList>" + attachHTML + '</ul>');
        }
      },
      (error) => console.log("The error returned from the server is" + error)
    );
  }
}
