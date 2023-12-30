// popup.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup',
  template: `
    <h2>{{ data.message }}</h2>
  `
})
export class PopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
