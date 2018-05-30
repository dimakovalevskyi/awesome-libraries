import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  constructor(
    private dialog: MatDialog
  ) { }

  open(text: string|null) {
    return this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: text
      }).afterClosed().toPromise()
      .then(data => {
        if (!data) {
          throw new Error('Dialog rejected');
        }
      });
  }
}
