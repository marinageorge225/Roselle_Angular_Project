import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appHighlightCard]',
})
export class HighlightCard {

  constructor(element:ElementRef) { //ElementRef is the type of any html tag 
    element.nativeElement.style.backgroundColor = '#e8e0d8'
  }

}
