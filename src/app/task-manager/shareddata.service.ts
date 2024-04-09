import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ShareddataService {
  private devTypeList: any[] = [];

  setDevTypeList(data: any[]): void {
    this.devTypeList = data;
  }

  getDevTypeList(): any[] {
    return this.devTypeList;
  }
  public taskid = new BehaviorSubject<number>(0);
  public story_Id = new BehaviorSubject<number>(0);
  public taskstartdate = new BehaviorSubject<any>('');
  public taskenddate = new BehaviorSubject<any>('');
  public  sprintfromdate = new BehaviorSubject<any>('');
  public  startdate = new BehaviorSubject<any>('');
  public  enddate = new BehaviorSubject<any>('');
  public sprinttodate = new BehaviorSubject<any>('');
  public storyName = new BehaviorSubject<any>('');
  public sprintName = new BehaviorSubject<any>('');
  public unassignedit = new BehaviorSubject<any>('');
  public assignedit = new BehaviorSubject<any>('');
  public brdview = new BehaviorSubject<any>('');
  public brddata = new BehaviorSubject<any>('');
  public  clientname = new BehaviorSubject<any>('');
  public  modulename = new BehaviorSubject<any>('');
  public  projectname = new BehaviorSubject<any>('');
  public  taskcode = new BehaviorSubject<any>('');
  public  dependency = new BehaviorSubject<any>('');
  public  taskstatus = new BehaviorSubject<any>('');
}


