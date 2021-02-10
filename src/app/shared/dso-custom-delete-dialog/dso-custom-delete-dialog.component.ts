import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dso-custom-delete-dialog',
  templateUrl: './dso-custom-delete-dialog.component.html',
  styleUrls: ['./dso-custom-delete-dialog.component.scss']
})
export class DsoCustomDeleteDialogComponent implements OnInit {
  description: string = '';
  rowData: any;
  constructor(private dialogRef: MatDialogRef<DsoCustomDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) { 
      this.description = data.title;
      this.rowData = data.rowData
    }

  ngOnInit(): void {

  }

  close() {
    this.dialogRef.close();
  }

}
