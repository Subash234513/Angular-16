import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CMSSharedService {
  public ProjectView = new BehaviorSubject<string>('');
  public Project_Create_Or_Edit = new BehaviorSubject<string>('');
  public ProposalView = new BehaviorSubject<string>('');
  public identificationView = new BehaviorSubject<string>('');
  public identificationCreate = new BehaviorSubject<string>('');
  public SupplierCatlog = new BehaviorSubject<string>('');



  constructor() { }
}
