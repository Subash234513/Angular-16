import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amountPipeCustom'
})
export class AmountPipeCustomPipe implements PipeTransform {

  transform(value: number | string, locale?: string): string {
    return new Intl.NumberFormat(('en-IN'), {
      minimumFractionDigits: 2,
      style: 'currency', currency: 'INR'
    }).format(Number(value));
  }

}
