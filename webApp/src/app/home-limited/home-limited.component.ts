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
  htmlToAdd:string;


  constructor(private fb: FormBuilder, private appService: HttpCallsService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.searchCourseForm = this.fb.group({
      subject:"",
      courseNumber:""
    });
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
}
