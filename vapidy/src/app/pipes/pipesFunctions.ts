import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'precisionRound'
})
export class PrecisionRound implements PipeTransform {
  transform(nb, precision){
    const factor = Math.pow(10, precision);
    return Math.round(nb * factor) / factor;
  }
}
