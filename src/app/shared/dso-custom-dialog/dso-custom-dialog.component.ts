import { Component, OnChanges, OnInit, Inject} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dso-custom-dialog',
  templateUrl: './dso-custom-dialog.component.html',
  styleUrls: ['./dso-custom-dialog.component.scss']
})
export class DsoCustomDialogComponent implements OnInit{
  form: FormGroup = this.formBuilder.group({});
  description: string = '';
  config: any;
  row: any;
  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DsoCustomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data) { 
      this.description = data.title;
      this.config = data.config;
      this.row = data.rowData;
    }

  ngOnInit(): void {
  console.log(this.config);
  this.initFormBuilder();
  }


  initFormBuilder() {
    this.form = this.formBuilder.group({});
    this.config.forEach(field => {
      const validationArray = [];
      if (field['required']) {
        validationArray.push(Validators.required);
      }
      const formControl = new FormControl(this.row[field['name']] ? this.row[field['name']] : '', validationArray);
      this.form.addControl(field['name'], formControl);
    });
  }

  save() {
    console.log(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
