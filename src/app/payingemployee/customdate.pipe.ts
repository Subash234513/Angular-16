import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customdate'
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);
    return new DatePipe('en-US').transform(date, 'MMMM');
  }
}

