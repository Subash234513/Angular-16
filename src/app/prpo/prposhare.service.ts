import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class PRPOshareService {
public Prapprover = new BehaviorSubject<String>('');
public CommodityEdit           = new BehaviorSubject<string>('');
public DelmatEdit              = new BehaviorSubject<string>('');
public Delmatappshare          = new BehaviorSubject<string>('');
public ApcategoryEdit          = new BehaviorSubject<string>('');
public BSShare                 = new BehaviorSubject<string>('');
public CCShare                 = new BehaviorSubject<string>('');
public ParParentShare          = new BehaviorSubject<string>('');
public ParcheckerShare         = new BehaviorSubject<string>('');
public ParStatusShare          = new BehaviorSubject<string>('');
public MepParentShare          = new BehaviorSubject<string>('');
public MEPcheckerShare         = new BehaviorSubject<string>('');
public MepStatusShare          = new BehaviorSubject<string>('');
public PocloseShare            = new BehaviorSubject<string>('');
public PocloseapprovalShare    = new BehaviorSubject<string>('');
public PoreopenShare           = new BehaviorSubject<string>('');
public PocancelShare           = new BehaviorSubject<string>('');
public PocancelapprovalShare   = new BehaviorSubject<string>('');
public PoShare                 = new BehaviorSubject<string>('');
public PoApproveShare          = new BehaviorSubject<string>('');
public grnapprovalShare        = new BehaviorSubject<string>('');
public grnsummaryid            = new BehaviorSubject<string>('');
public grndetailsviewsummaryid = new BehaviorSubject<string>('');
public grninwardsummaryid      = new BehaviorSubject<string>('');
public pomakerstate            = new BehaviorSubject<any>('');
public pocheckerstate          = new BehaviorSubject<any>('');
public poclosemakerstate       = new BehaviorSubject<any>('');
public poclosecheckerstate     = new BehaviorSubject<any>('');
public pocancelmakerstate      = new BehaviorSubject<any>('');
public pocancelcheckerstate    = new BehaviorSubject<any>('');
public poreeopenstate          = new BehaviorSubject<any>('');
public poamendmentshare        = new BehaviorSubject<any>('');
public prsummary               = new BehaviorSubject<any>('');
public rcnsummary              = new BehaviorSubject<any>('');
public rcnrelease              = new BehaviorSubject<string>('');

  constructor() { }
}
