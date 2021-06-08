import { Component, OnChanges, OnInit, Inject} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-dso-custom-dialog-stepper',
  templateUrl: './dso-custom-dialog-stepper.component.html',
  styleUrls: ['./dso-custom-dialog-stepper.component.scss']
})
export class DsoCustomDialogStepperComponent implements OnInit{
  form: FormGroup = this.formBuilder.group({});
  itemConfirmUpload = false;
  publishData :any;
   constructor(@Inject(MAT_DIALOG_DATA) public data: any ,private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DsoCustomDialogStepperComponent>) { 
      this.publishData = data;
      }

  ngOnInit(): void {}

  save() {
    console.log(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

}
