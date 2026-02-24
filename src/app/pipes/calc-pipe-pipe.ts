import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'calc', standalone: true })
export class CalcPipe implements PipeTransform {
  transform(value: number, rate: number = 1): string {
    return 'SAR ' + (value * rate).toLocaleString('en-SA', { minimumFractionDigits: 2 });
  }
}