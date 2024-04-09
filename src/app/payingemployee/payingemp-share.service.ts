import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayingempShareService {

  constructor() { }

  public empView_id = new BehaviorSubject<any>('');
  public payroll = new BehaviorSubject<any>('');
  public employeepf = new BehaviorSubject<any>('');
 
}
