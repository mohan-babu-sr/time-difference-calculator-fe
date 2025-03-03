import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentFormat'
})
export class MomentFormatPipe implements PipeTransform {
  transform(value: string | Date): string {
    return value ? moment(value).format('LL') : '-';
  }
}
