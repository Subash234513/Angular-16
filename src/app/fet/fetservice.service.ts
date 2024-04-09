import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { environment } from '../AppAutoEngine/import-services/CommonimportFiles';

const url = environment.apiURL
const goldurl='http://143.110.244.51:8194/'

const goldtoken = '627804866477e9ed368bdb63e92805168f2944e63c2583ec9941d74bb2768192'

@Injectable({
  providedIn: 'root'
})
export class FetserviceService {

  constructor(private http: HttpClient) { }

  Headers() {
    return { 'Authorization': 'Token ' + JSON.parse(localStorage.getItem("sessionData")).token }
  }


  public executivesubmit(value): Observable<any> {
    return this.http.post<any>(url + "fetserv/fet_create",value, { 'headers': this.Headers()})
  }

  public getUnitHeadFilter(appkeyvalue, pageno): Observable<any> {
   
    return this.http.get<any>(url + 'taskserv/search_unit_head?query=' + appkeyvalue + '&page=' + pageno, { 'headers': this.Headers() })
  }

  public getTeamLeadFilter(appkeyvalue, pageno): Observable<any> {
   
    return this.http.get<any>(url + 'taskserv/search_team_lead?query=' + appkeyvalue + '&page=' + pageno, { 'headers': this.Headers() })
  }

  public getexecutivesummary(page): Observable<any> {
   
    return this.http.get<any>(url + 'fetserv/fet_create?page='+page, { 'headers': this.Headers() })
  }

  public executiveedit(id): Observable<any> {
   
    return this.http.get<any>(url + 'fetserv/fet_get/'+id, { 'headers': this.Headers() })
  }

  public executivedropdown(value): Observable<any> {

    return this.http.get<any>(url + 'fetserv/executive_action_dropdown?query='+value, { 'headers': this.Headers() })
  }
  
  public getexecutivedropdown(value): Observable<any> {
    
    return this.http.get<any>(goldurl + 'saleserv/executive_map_maker?status=1&type=1&page=1&employee_id='+value, { 'headers': { 'Authorization': 'Token ' + goldtoken } })
  }

  public gettaskdropdown(): Observable<any> {

    return this.http.get<any>(url + 'fetserv/task_drop_down', { 'headers': this.Headers() })
  }

  public getemployeedropdown(value,page): Observable<any> {
   
    return this.http.get<any>(url + "usrserv/searchemployee?query="+value+'&page='+page, { 'headers': this.Headers()})
  }

}

