import { Component } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-open-dialog',
  template: `
<h2 mat-dialog-title>Імпотрувати данні з файлу</h2>
<mat-dialog-content>

  <div class="form-group">
    <input id="file-upload" type="file" accept=".json" (change)="fileUpload($event)">
  </div>

</mat-dialog-content>
<mat-dialog-actions>
  <button mat-button color="warn" mat-dialog-close>Вийти</button>
  <button mat-raised-button color="primary"
    [disabled]="!isDataValid"
    [mat-dialog-close]="importedData">Імпортувати</button>
</mat-dialog-actions>
`,
  styles: [`.form-group{ margin-bottom: 20px; }`]
})
export class ImportComponent {

  importedData: any = {};
  isDataValid = false;

  constructor(
    public dialogRef: MatDialogRef<ImportComponent>,
    public notification: MatSnackBar
  ) { }

  /**
   * Unfortunately, i dont't have enough time for this :(
   *
   * @param data - data for validation
   */
  validateData(data) {
    return true;
  }

  /**
   * Change event for input[type="file"]
   *
   * @param {Object} event event object
   */
  fileUpload(event) {
    const file = event.target.files[0];
    if (!file) {
      this.notification.open('Буль ласка, виберіть корректний файл експорту');
      this.isDataValid = false;
      return;
    }
    const reader = new FileReader();

    reader.onload = function(e) {
      try {
        this.importedData = JSON.parse(e.target.result);
      } catch (exception) {
        this.notification.open('JSON не корректний!');
        this.isDataValid = false;
        return;
      }
      this.isDataValid = this.validateData(this.importedData);
    }.bind(this);
    reader.readAsText(file);
  }
}
