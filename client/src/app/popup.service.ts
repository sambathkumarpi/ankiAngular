// popup.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from './popup/popup.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  constructor(private dialog: MatDialog) {}

  openSuccessPopup(): void {
    this.dialog.open(PopupComponent, {
      width: '400px',
      data: { message: 'Success! You have reached the end of the flashcard list.' }
    });
  }
}
