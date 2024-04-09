import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class SharedHrmsService {

  public employeeview = new BehaviorSubject<string>('');
  constructor() { }
}
