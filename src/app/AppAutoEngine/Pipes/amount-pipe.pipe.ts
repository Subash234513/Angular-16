import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amountPipe'
})
export class AmountPipePipe implements PipeTransform {


  transform(value: number | string, locale?: string): string {
    return new Intl.NumberFormat(('en-IN'), {
      minimumFractionDigits: 2,
      style: 'currency', currency: locale || 'INR'
    }).format(Number(value));
  }

}
