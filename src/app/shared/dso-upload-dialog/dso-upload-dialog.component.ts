import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dso-upload-dialog',
  templateUrl: './dso-upload-dialog.component.html',
  styleUrls: ['./dso-upload-dialog.component.scss']
})
export class DsoUploadDialogComponent implements OnInit {
  description: string = '';
  fileToUpload: File = null;
  constructor(private dialogRef: MatDialogRef<DsoUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) { 
      this.description = data.title;
    }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}

}
