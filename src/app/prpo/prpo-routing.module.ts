import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
/////Masters
import { PrpomasterComponent } from '../prpo/prpomaster/prpomaster.component';
import { CommodityComponent } from '../prpo/commodity/commodity.component';
import { DelmatMakerComponent } from '../prpo/delmat-maker/delmat-maker.component';
// import { DelmatApprovalComponent }       from '../prpo/delmat-approval/delmat-approval.component';
// import { ApcategoryComponent } from '../prpo/apcategory/apcategory.component';
////Transations
///PAR
// import { PARSummaryComponent }           from '../prpo/par-summary/par-summary.component';
import { PARMakeDetailsComponent } from '../prpo/par-make-details/par-make-details.component';
// import { ParCheckerComponent }           from '../prpo/par-checker/par-checker.component';
import { ParMakeDetailsEditComponent } from '../prpo/par-make-details-edit/par-make-details-edit.component';
import { ParCheckerEditComponent } from '../prpo/par-checker-edit/par-checker-edit.component';
import { ParcreateEditComponent } from '../prpo/parcreate-edit/parcreate-edit.component';
import { ParStatusScreenComponent } from '../prpo/par-status-screen/par-status-screen.component'
///MEP
// import { MEPsummaryComponent }           from '../prpo/mepsummary/mepsummary.component';
import { MEPmakeComponent } from '../prpo/mepmake/mepmake.component';
// import { MEPmakeEditComponent }          from '../prpo/mepmake-edit/mepmake-edit.component';
// import { MEPapprovesummaryComponent }    from '../prpo/mepapprovesummary/mepapprovesummary.component';
import { MEPapproverComponent } from '../prpo/mepapprover/mepapprover.component';
import { MepcontigencyComponent } from '../prpo/mepcontigency/mepcontigency.component';
import { MepStatusScreenComponent } from '../prpo/mep-status-screen/mep-status-screen.component';

///////PR
import { PrapproverComponent } from '../prpo/prapprover/prapprover.component';
// import { PrapproversummaryComponent } from '../prpo/prapproversummary/prapproversummary.component';
import { PrMakerComponent } from '../prpo/pr-maker/pr-maker.component'
// import { PrcreateeditComponent }         from './prcreateedit/prcreateedit.component';



/////////////////////Close, Open, Reopen
// import { PoclosesummaryComponent }       from '../prpo/poclosesummary/poclosesummary.component';
import { PoclosecreateComponent } from './poclosecreate/poclosecreate.component';
// import { PoCloseApprovalSummaryComponent }from '../prpo/po-close-approval-summary/po-close-approval-summary.component';
import { PoCloseApprovalComponent } from '../prpo/po-close-approval/po-close-approval.component';
// import { PoReopenSummaryComponent }       from '../prpo/po-reopen-summary/po-reopen-summary.component';
import { PoReopenComponent } from '../prpo/po-reopen/po-reopen.component';
// import { PoCancelSummaryComponent }       from '../prpo/po-cancel-summary/po-cancel-summary.component';
import { PoCancelComponent } from '../prpo/po-cancel/po-cancel.component';
// import { PoCancelApprovalSummaryComponent }from '../prpo/po-cancel-approval-summary/po-cancel-approval-summary.component';
import { PoCancelApprovalComponent } from '../prpo/po-cancel-approval/po-cancel-approval.component';

/////////////////////PO summary create and approval 
// import { PoMakerSummaryComponent }        from '../prpo/po-maker-summary/po-maker-summary.component';
// import { PoApprovalSummaryComponent }     from '../prpo/po-approval-summary/po-approval-summary.component'
// import { PoamendmentsummaryComponent }    from '../prpo/poamendmentsummary/poamendmentsummary.component'
import { PoModificationComponent } from '../prpo/po-modification/po-modification.component'
import { PoCreatedummyComponent } from '../prpo/po-createdummy/po-createdummy.component';
import { PoApprovalComponent } from '../prpo/po-approval/po-approval.component';

/////tabs
import { PrpoParTabsComponent } from '../prpo/prpo-par-tabs/prpo-par-tabs.component';
import { PrpoTabsMEPComponent } from '../prpo/prpo-tabs-mep/prpo-tabs-mep.component';
import { PrpoTabsPOComponent } from '../prpo/prpo-tabs-po/prpo-tabs-po.component';
import { PrpoTabsPRComponent } from '../prpo/prpo-tabs-pr/prpo-tabs-pr.component';
import { PrpoTabsGRNComponent } from './prpo-tabs-grn/prpo-tabs-grn.component';

////GRN
// import { GRNInwardFormComponent }         from '../prpo/grn-inward-form/grn-inward-form.component'
import { GrnInwardCreateeditdeleteComponent } from './grn-inward-createeditdelete/grn-inward-createeditdelete.component';
// import { GrnapproveerSummaryComponent }   from './grnapproveer-summary/grnapproveer-summary.component'
import { GrnapproveerViewComponent } from './grnapproveer-view/grnapproveer-view.component'
import { GrnViewComponent } from './grn-view/grn-view.component';

///RCN
import { RCNViewComponent } from './rcnview/rcnview.component';
import { RentConfirmationNoteComponent } from './rent-confirmation-note/rent-confirmation-note.component'
import { RentCNoteCreateComponent } from './rent-cnote-create/rent-cnote-create.component'
import { CanActivateGuardService } from '../can-activate-guard.service';

const routes: Routes = [
  {
    path: '', canActivate: [CanActivateGuardService],
    children: [
      { path: 'procurementmaster', component: PrpomasterComponent },
      { path: 'commodity', component: CommodityComponent },
      { path: 'delmatmaker', component: DelmatMakerComponent },
      // { path: 'delmatapproval', component: DelmatApprovalComponent },
      // { path: 'apcategory', component: ApcategoryComponent },
      ////Transations
      // { path: 'parmaker', component: PARSummaryComponent },           ////par summary
      { path: 'PARmakeradd', component: PARMakeDetailsComponent },       ////par create form
      { path: 'Paredit', component: ParcreateEditComponent },        ////par create form edit
      { path: 'PARcontigencyedit', component: ParMakeDetailsEditComponent },   ////par contigency form
      // { path: 'parapprover', component: ParCheckerComponent },           ////par checker summary
      { path: 'PARcheckerApprove', component: ParCheckerEditComponent },       ////par checker approve or reject screen
      { path: 'PARStatus', component: ParStatusScreenComponent },      ////par Final Status Screen
      // { path: 'mepmaker', component: MEPsummaryComponent },           ////Mep summary
      { path: 'MEPmakeradd', component: MEPmakeComponent },              ////Mep create form
      // { path: 'MEPmakerEdit', component: MEPmakeEditComponent },          ////Mep create form edit
      // { path: 'mepapprover', component: MEPapprovesummaryComponent },    ////Mep checker summary
      { path: 'MEPapprovereject', component: MEPapproverComponent },          ////Mep checker approve or reject screen
      { path: 'Mepcontigency', component: MepcontigencyComponent },        ////Mep contigency form
      { path: 'MEPStatus', component: MepStatusScreenComponent },      ////par Final Status Screen
      // { path: 'poclosemaker', component: PoclosesummaryComponent },       ////PO close summary
      { path: 'poclosecreate', component: PoclosecreateComponent },        ////PO close create
      // { path: 'pocloseapprover', component: PoCloseApprovalSummaryComponent },////PO close approval summary
      { path: 'pocloseapproval', component: PoCloseApprovalComponent },      ////PO close approval screen
      // { path: 'poreopen', component: PoReopenSummaryComponent },      ////PO reopen
      { path: 'poreopencreate', component: PoReopenComponent },             ////PO reopen create
      // { path: 'pocancelmaker', component: PoCancelSummaryComponent },      ////PO cancel summary
      { path: 'pocancel', component: PoCancelComponent },             ////PO cancel create  
      // { path: 'pocancelapprover', component: PoCancelApprovalSummaryComponent },////PO cancel approve summary
      { path: 'pocancelapprovalreject', component: PoCancelApprovalComponent },      ////PO cancel approve or reject screen
      // { path: 'pomaker', component: PoMakerSummaryComponent },        ////PO Summary
      // { path: 'poapprover', component: PoApprovalSummaryComponent },     ////PO approval summary
      { path: 'poapprovelScreen', component: PoApprovalComponent },            ////PO approval action screen 
      { path: 'podummy', component: PoCreatedummyComponent },         ////PO Create
      { path: 'bpa', component: PrpoParTabsComponent },           ////Par tab
      { path: 'pca', component: PrpoTabsMEPComponent },           ////MEP tab
      { path: 'po', component: PrpoTabsPOComponent },            ////PO tab
      { path: 'pr', component: PrpoTabsPRComponent },             ////PR tab
      // { path: 'poapprover', component: PoApprovalSummaryComponent },     ////PO Create
      { path: 'prapprover', component: PrapproverComponent },          ////Prapprover
      // { path: 'prappsummary', component: PrapproversummaryComponent },  ////Prapprover Summary
      { path: 'prmakers', component: PrMakerComponent },         ////Pr Maker
      // { path: 'grninward', component: GRNInwardFormComponent },
      { path: 'grninwardform', component: GrnInwardCreateeditdeleteComponent },
      // { path: 'grnapproversummary', component: GrnapproveerSummaryComponent },
      { path: 'grnapproverview', component: GrnapproveerViewComponent },
      { path: 'grninwardassetsdetails', component: GrnViewComponent },
      { path: 'grn', component: PrpoTabsGRNComponent },
      { path: 'PRApprover', component: PrapproverComponent },
      // { path: 'PRApproverSummary', component: PrapproversummaryComponent },
      { path: 'grn', component: PrpoTabsGRNComponent },
      // { path: 'predit', component: PrcreateeditComponent },
      { path: 'RCNview', component: RCNViewComponent },
      // { path: 'PoeditSummary', component: PoamendmentsummaryComponent },
      { path: 'Poedit', component: PoModificationComponent },
      { path: 'rcn', component: RentConfirmationNoteComponent },
      { path: 'rcnotecreate', component: RentCNoteCreateComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PRPORoutingModule { }
