import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  createSchedule(theForm: any, scheduleName: string): Observable<any>{
    return this.http.post(this.rootURL + '/schedule/' + scheduleName, theForm);
  }

  getSchedule(theForm: any, scheduleName: string){
    return this.http.get(this.rootURL + '/schedule/' + scheduleName, {params: {scheduleName: theForm.retrieveSchedule, subject: theForm.subject, courseNumber: theForm.courseNumber, courseComponent: theForm.courseComponent}});
  }

  getSchedules(){
    return this.http.get(this.rootURL + '/schedules/public');
  }

  getSchedulesPrivate(){
    return this.http.get(this.rootURL + '/schedules/private');
  }

  addCourses(theForm: any, scheduleName: string, scheduleForm: string){
    return this.http.post(this.rootURL + '/schedule/' + scheduleName + '/' + scheduleForm, theForm);
  }

  deleteSchedule(scheduleName: string){
    return this.http.delete(this.rootURL + '/schedule/' + scheduleName);
  }

  deleteSchedules(){
    return this.http.delete(this.rootURL + '/schedules');
  }

  resendEmail(theForm: any): Observable<any>{
    return this.http.post(this.rootURL + '/user/resendEmail', theForm);
  }
}
