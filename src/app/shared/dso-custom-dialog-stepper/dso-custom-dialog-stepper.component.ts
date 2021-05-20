import { Component, OnChanges, OnInit, Inject} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-dso-custom-dialog-stepper',
  templateUrl: './dso-custom-dialog-stepper.component.html',
  styleUrls: ['./dso-custom-dialog-stepper.component.scss']
})
export class DsoCustomDialogStepperComponent implements OnInit{
  form: FormGroup = this.formBuilder.group({});
   
  constructor(private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DsoCustomDialogStepperComponent>) { 
      }

  ngOnInit(): void {}

  save() {
    console.log(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
