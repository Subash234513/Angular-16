

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'currencyFormat' })
export class CurrencyFormatPipe implements PipeTransform {
transform(value: any, column: string): any {
    // List of column names to apply currency formatting
    const columnsToFormat = ['Gross pay_std', 'Std Annual Monthly Bonus', 'Std Basic','Std DA','Std CmpESI', 'Std CmpPF', 'Std Conveyance', 'Std HRA', 'Std Medical', 'TELEPHONE','OTHERS','Medical','LTA','HRA','Extra Allowance','Conveyance','Cmpy contStd CmpPF','Cmpy contStd CmpESI','Basic','DA','Annual Monthly Bonus','Gross pay','Std TELEPHONE','Std OTHERS','Std LTA', 'Std Emp deductions  PF','Std Emp deductions  ESI','Custom Deductions','Extra Allowance','ESI','PF','TDS','Std TDS','Custom Deduction','NetSalary','Std_NetSalary','Std Emp deductions  nan'];

    
    if (isNaN(value) || !isFinite(value)) {
      return value;
    }

    if (columnsToFormat.includes(column)) {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
    } else {
      return value;
    }
  }
}
