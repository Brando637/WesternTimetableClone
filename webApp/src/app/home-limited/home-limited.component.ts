import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'
import { HttpCallsService } from '../http-calls.service';

@Component({
  selector: 'app-home-limited',
  templateUrl: './home-limited.component.html',
  styleUrls: ['./home-limited.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeLimitedComponent implements OnInit {

  searchCourseForm: FormGroup;
  createScheduleForm: FormGroup;
  displayScheduleForm: FormGroup;
  deleteScheduleForm: FormGroup;
  addCourseScheduleForm: FormGroup;
  htmlToAdd:string;


  constructor(private fb: FormBuilder, private appService: HttpCallsService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.searchCourseForm = this.fb.group({
    });

    this.createScheduleForm = this.fb.group({
    });

    this.displayScheduleForm = this.fb.group({
      retrieveSchedule: "",
      subject: "",
      courseNumber: "",
      courseComponent: ""
    });

    this.deleteScheduleForm = this.fb.group({
      deleteSchedule: ""
    })

    this.addCourseScheduleForm = this.fb.group({
      subject: "Enter Subject Name",
      courseNumber: "eg. 1001",
      courseComponent: "All",
      scheduleName:"Name of schedule"
    })
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
            attachHTML += '<div class=descrip>' + response[x].descrip + '</div>';
            attachHTML += '<div class=' + response[x].component + '>' + response[x].component + '</div>';
          }
          console.log("The response from the server is " + response);
          this.htmlToAdd = '<ul class=scheduleList>' + attachHTML + '</ul>';
        }
      },
      (error) => console.log("The error returned from the server is" + error)
    );
  }

  onCreateSchedule(): void {
    console.log(this.createScheduleForm);
    this.appService.createSchedule(this.createScheduleForm.value, this.createScheduleForm.value.scheduleName).subscribe(
      (response) => {
        console.log("The response from the server is " + response)
        this.htmlToAdd = '<h2>'+response.toString()+'</h2>';
      },
      (error) => console.log("The error returned from the server is" + error)
    );
  }

  onGetSchedule(): void {
    console.log(this.displayScheduleForm);
    this.appService.getSchedule(this.displayScheduleForm.value, this.displayScheduleForm.value.retrieveSchedule).subscribe(
      (response) => {
        var attachHTML = "";
        var responseString = response.toString();
        if (responseString.includes("Sorry"))
        {
          this.htmlToAdd = '<h2>' + response.toString() + '</h2>';
        }
        else if (response.toString().length == 0)
        {
          this.htmlToAdd = "<h2> Sorry, but there are no courses added to this schedule </h2>";
        }
        else
        {
          for (let x in response) 
          {
            attachHTML += '<h2>' + response[x].subject + ' - ' + response[x].className + ' ' + response[x].catalog_nbr + '</h2>';
            attachHTML += '<div class=descrip>' + response[x].descrip + '</div>';
            attachHTML += '<div class=' + response[x].component + '>' + response[x].component + '</div>';
          }
          this.htmlToAdd = '<ul class=scheduleList>' + attachHTML + '</ul>';
        }
      },
      (error) => {}
    );
  }

  onAddCourseSchedule(): void {
    console.log(this.addCourseScheduleForm);
    this.appService.addCourses(this.addCourseScheduleForm.value, this.addCourseScheduleForm.value.scheduleName, this.addCourseScheduleForm.value.course).subscribe(
      (response) => {
        console.log("The response from the server is " + response)
        this.htmlToAdd = '<h2>'+response.toString()+'</h2>';
      },
      (error) => console.log("The error returned from the server is" + error)
    );
  }

  onDeleteSchedule(): void {
    console.log(this.deleteScheduleForm.value);
    this.appService.deleteSchedule(this.deleteScheduleForm.value.deleteSchedule).subscribe(
      (response) => {
        console.log("The response from the server is " + response)
        this.htmlToAdd = '<h2>'+response.toString()+'</h2>';
      },
      (error) => console.log("The error returned from the server is" + error)
    );
  }

  onDeleteSchedules(): void {
    console.log("The delete all button worked")
    this.appService.deleteSchedules().subscribe(
      (response) => {
        console.log("The response from the server is " + response)
        this.htmlToAdd = '<h2>'+response.toString()+'</h2>';
      },
      (error) => console.log("The error returned from the server is " + error)
    );
  }
}
