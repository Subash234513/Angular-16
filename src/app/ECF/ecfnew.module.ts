import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { ToastrModule } from 'ngx-toastr';
import {EcfRoutingModule} from './ecf-routing.module';
import{EcfSummaryComponent} from './ecf-summary/ecf-summary.component';
import { EcfapprovalSummaryComponent } from './ecfapproval-summary/ecfapproval-summary.component';
import { ApproverheaderViewComponent } from './approverheader-view/approverheader-view.component';
import { ApproverinvoicedetailViewComponent } from './approverinvoicedetail-view/approverinvoicedetail-view.component';
import { EcfsummaryViewComponent } from './ecfsummary-view/ecfsummary-view.component';
import { EcfsummaryinvdetailViewComponent } from './ecfsummaryinvdetail-view/ecfsummaryinvdetail-view.component';
import { EcfInventoryComponent } from './ecf-inventory/ecf-inventory.component';
import {EcfComponent} from './ecf/ecf.component';
import { EcfcoviewComponent } from './ecfcoview/ecfcoview.component'
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MailviewComponent } from './mailview/mailview.component';





@NgModule({
  declarations: [EcfSummaryComponent, EcfapprovalSummaryComponent, ApproverheaderViewComponent, ApproverinvoicedetailViewComponent, 
    EcfsummaryViewComponent, EcfsummaryinvdetailViewComponent 
    , EcfInventoryComponent,EcfComponent, EcfcoviewComponent, MailviewComponent],
  imports: [
    
    EcfRoutingModule,
    SharedModule,
    MaterialModule,
    ToastrModule,
    PdfViewerModule
    

  ]
})
export class EcfnewModule { }
