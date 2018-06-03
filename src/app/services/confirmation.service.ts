import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';

/**
 * Service for open confirmaiton dialog
 *
 * @export
 * @class ConfirmationService
 */
@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  constructor(
    private dialog: MatDialog
  ) { }

  /**
   * Open confirmation message
   * Yes -> promise will be resolved
   * No -> promise will rejected
   *
   * @param {string} text
   * @returns {Promise}
   * @memberof ConfirmationService
   */
  open(text: string) {
    return this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: text
      }).afterClosed().toPromise()
      .then(data => {
        if (!data) {
          return Promise.reject('Dialog rejected');
        }
      });
  }
}
