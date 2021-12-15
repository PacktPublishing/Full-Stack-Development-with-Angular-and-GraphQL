import { Directive, AfterViewInit } from '@angular/core';
import { MatInput } from '@angular/material/input';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {

  constructor(private matInput: MatInput) { }
  ngAfterViewInit() {
    this.matInput.focus();
  }
}
