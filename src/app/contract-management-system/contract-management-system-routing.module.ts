import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CmsMasterComponent } from './cms-master/cms-master.component';
import { ContractManagementSystemComponent } from './contract-management-system/contract-management-system.component'
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { ProposalViewComponent } from './proposal-view/proposal-view.component';
import { AgreementBuilderComponent } from './agreement-builder/agreement-builder.component';



const routes: Routes = [
  {path:'cmsmaster', component:CmsMasterComponent},
  {path:'cms', component:ContractManagementSystemComponent},
  {path:'project', component:ProjectCreateComponent},
  {path:'cmsview', component:ProjectViewComponent},
  {path:'proposalview', component:ProposalViewComponent},
  {path:'agmtbuilder', component:AgreementBuilderComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractManagementSystemRoutingModule { }
