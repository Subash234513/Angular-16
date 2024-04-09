import { NgModule } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PRPORoutingModule } from './prpo-routing.module';
import { CommodityComponent } from './commodity/commodity.component';
import { PrpomasterComponent } from './prpomaster/prpomaster.component';
import { PARMakeDetailsComponent } from './par-make-details/par-make-details.component';
import { ParMakeDetailsEditComponent } from './par-make-details-edit/par-make-details-edit.component';
import { ParCheckerEditComponent } from './par-checker-edit/par-checker-edit.component';
import { MEPmakeComponent } from './mepmake/mepmake.component';
import { MEPapproverComponent } from './mepapprover/mepapprover.component';
import { DelmatMakerComponent } from './delmat-maker/delmat-maker.component';
// import { ApcategoryComponent } from './apcategory/apcategory.component';
// import { ApsubcatComponent } from './apsubcat/apsubcat.component';
// import { BusinessSegmentComponent } from './business-segment/business-segment.component';
// import { CostCenterComponent } from './cost-center/cost-center.component';
// import { CreateCCBSComponent } from './create-ccbs/create-ccbs.component';
import { ParcreateEditComponent } from './parcreate-edit/parcreate-edit.component';
import { MepcontigencyComponent } from './mepcontigency/mepcontigency.component';
import { PoclosecreateComponent } from './poclosecreate/poclosecreate.component';
import { PoCloseApprovalComponent } from './po-close-approval/po-close-approval.component';
import { PoCancelComponent } from './po-cancel/po-cancel.component';
import { PoCancelApprovalComponent } from './po-cancel-approval/po-cancel-approval.component';
import { PoReopenComponent } from './po-reopen/po-reopen.component';
import { ParStatusScreenComponent } from './par-status-screen/par-status-screen.component';
import { MepStatusScreenComponent } from './mep-status-screen/mep-status-screen.component';
import { PoCreatedummyComponent } from './po-createdummy/po-createdummy.component';
import { PoApprovalComponent } from './po-approval/po-approval.component';
import { PrpoParTabsComponent } from './prpo-par-tabs/prpo-par-tabs.component';
import { PrpoTabsMEPComponent } from './prpo-tabs-mep/prpo-tabs-mep.component';
import { PrpoTabsPRComponent } from './prpo-tabs-pr/prpo-tabs-pr.component';
import { PrpoTabsPOComponent } from './prpo-tabs-po/prpo-tabs-po.component';
import { PrpoTabsGRNComponent } from './prpo-tabs-grn/prpo-tabs-grn.component';
import { GrnInwardCreateeditdeleteComponent } from './grn-inward-createeditdelete/grn-inward-createeditdelete.component';
import { GrnViewComponent } from './grn-view/grn-view.component';
import { GrnapproveerViewComponent } from './grnapproveer-view/grnapproveer-view.component';
// import { PrsummaryComponent } from './prsummary/prsummary.component';
// import { PrapproversummaryComponent } from './prapproversummary/prapproversummary.component';
import { PrapproverComponent } from './prapprover/prapprover.component';
// import { RCNComponent } from './rcn/rcn.component';
// import { RCNCreateComponent } from './rcncreate/rcncreate.component';
import { RCNViewComponent } from './rcnview/rcnview.component';
// import { RcnapproverComponent } from './rcnapprover/rcnapprover.component';
// import { RcnapproversummaryComponent } from './rcnapproversummary/rcnapproversummary.component';
// import { PrpoTabsRcnComponent } from './prpo-tabs-rcn/prpo-tabs-rcn.component';
import { PoModificationComponent } from './po-modification/po-modification.component';
import { PrMakerComponent } from './pr-maker/pr-maker.component';
import { RentConfirmationNoteComponent } from './rent-confirmation-note/rent-confirmation-note.component';
import { RentCNoteCreateComponent } from './rent-cnote-create/rent-cnote-create.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { AmountPipeCustomPipe } from './amount-pipe-custom.pipe';

@NgModule({
  declarations: [CommodityComponent, PrpomasterComponent, PARMakeDetailsComponent,
    ParMakeDetailsEditComponent, ParCheckerEditComponent,
    MEPmakeComponent, MEPapproverComponent,
    DelmatMakerComponent,
    //  ApcategoryComponent,
    // ApsubcatComponent, BusinessSegmentComponent, CostCenterComponent,
    // CreateCCBSComponent, 
    ParcreateEditComponent, MepcontigencyComponent, PoclosecreateComponent, PoCloseApprovalComponent, PoCancelComponent, PoCancelApprovalComponent, PoReopenComponent, ParStatusScreenComponent,
    MepStatusScreenComponent,
    PoCreatedummyComponent, PoApprovalComponent,
    PrpoParTabsComponent,
    PrpoTabsMEPComponent, PrpoTabsPRComponent, PrpoTabsPOComponent,
    PrpoTabsGRNComponent, GrnInwardCreateeditdeleteComponent,
    GrnViewComponent, GrnapproveerViewComponent,
    // PrsummaryComponent, PrapproversummaryComponent, 
    PrapproverComponent,
    // RCNComponent, RCNCreateComponent,
     RCNViewComponent, 
    //  RcnapproverComponent, RcnapproversummaryComponent, PrpoTabsRcnComponent, 
     PrMakerComponent, PoModificationComponent, RentConfirmationNoteComponent,
      RentCNoteCreateComponent,
      AmountPipeCustomPipe],

  imports: [
    PRPORoutingModule,
    PdfViewerModule, SharedModule, MaterialModule
  ]
})
export class PRPOModule { }
