import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpCallsService {

  constructor(private http: HttpClient) { }

  rootURL = '/api'

  searchCourse(theForm: any){
    return this.http.post<any>(this.rootURL + '/resultList', theForm );
  }

  searchCourseKeyword(theForm: any){
    return this.http.post(this.rootURL + '/keyword', theForm);
  }

  createSchedule(theForm: any, scheduleName: string){
    return this.http.post(this.rootURL + '/schedule/' + scheduleName, theForm);
  }

  getSchedule(theForm: any, scheduleName: string){
    return this.http.get(this.rootURL + '/schedule/' + scheduleName, {params: {scheduleName: theForm.retrieveSchedule, subject: theForm.subject, courseNumber: theForm.courseNumber, courseComponent: theForm.courseComponent}});
  }

  getSchedules(){
    return this.http.get(this.rootURL + '/schedules', {params: {schedules: "limited"}})
  }

  addCourses(theForm: any, scheduleName: string, scheduleForm: string){
    return this.http.post(this.rootURL + '/schedule/' + scheduleName + '/' + scheduleForm, theForm);
  }

  deleteSchedule(scheduleName: string){
    return this.http.delete(this.rootURL + '/schedule/' + scheduleName)
  }

  deleteSchedules(){
    return this.http.delete(this.rootURL + '/schedules')
  }
}
