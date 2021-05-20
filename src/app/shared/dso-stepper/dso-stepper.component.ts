import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { DsoUploadDialogComponent } from '../dso-upload-dialog/dso-upload-dialog.component';

@Component({
  selector: 'app-dso-stepper',
  templateUrl: './dso-stepper.component.html',
  styleUrls: ['./dso-stepper.component.scss']
})
export class DsoStepperComponent implements OnInit {
firstFormGroup: FormGroup;
secondFormGroup: FormGroup;
isClose = false;
@Input() 
title;
@Output()
  uploadData = new EventEmitter();
@Output() closeChanged: EventEmitter<boolean> =   new EventEmitter();
  constructor(private _formBuilder: FormBuilder,private dialog: MatDialog) { }
  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
}

openUploadDialog() {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;

  dialogConfig.data = {
    title: `Upload ${this.title}`,
 };

 const dialogRef =this.dialog.open(DsoUploadDialogComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(res => {
    if (res)
    this.uploadData.emit(res);
  });
}


closeSpets() {
  this.closeChanged.emit(this.isClose);
}
}
