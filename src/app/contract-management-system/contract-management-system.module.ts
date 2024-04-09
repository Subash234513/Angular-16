import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';

import { ContractManagementSystemRoutingModule } from './contract-management-system-routing.module';
import { CmsMasterComponent } from './cms-master/cms-master.component';
import { ContractManagementSystemComponent } from './contract-management-system/contract-management-system.component';
import { ProjectCreateComponent } from './project-create/project-create.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { AmountPipePipe } from './amount-pipe.pipe';
import { ProposalViewComponent } from './proposal-view/proposal-view.component';
import { IdentificationCreateComponent } from './identification-create/identification-create.component';
import { IdentificationViewComponent } from './identification-view/identification-view.component';
import { KeysetsPipe } from './keysets.pipe';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SupplierCatlogComponent } from './supplier-catlog/supplier-catlog.component';
import { AgreementBuilderComponent } from './agreement-builder/agreement-builder.component';

@NgModule({
  declarations: [CmsMasterComponent, ContractManagementSystemComponent, ProjectCreateComponent, 
    ProjectViewComponent, AmountPipePipe, ProposalViewComponent, IdentificationCreateComponent, IdentificationViewComponent, KeysetsPipe, SupplierCatlogComponent, AgreementBuilderComponent],
  imports: [
    CommonModule,
    ContractManagementSystemRoutingModule, ReactiveFormsModule, FormsModule,
    MaterialModule, SharedModule, PdfViewerModule
  ]
})
export class ContractManagementSystemModule { }
