import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { ItemConversionService } from 'src/app/services/item-conversion.service';

@Component({
  selector: 'app-dso-stepper',
  templateUrl: './dso-stepper.component.html',
  styleUrls: ['./dso-stepper.component.scss']
})
export class DsoStepperComponent implements OnInit {
firstFormGroup: FormGroup;
secondFormGroup: FormGroup;
showPublishToCloudSpinner = false;
@Input() 
selectedRowData;
itemConfirmUpload = false;
udaConfigConfirmUpload = false;
isClose = false;
@Input() 
title;
@Output()
  uploadData = new EventEmitter();
@Output() closeChanged: EventEmitter<boolean> =   new EventEmitter();
  constructor(private _formBuilder: FormBuilder,private dialog: MatDialog,
    private itemConversionService: ItemConversionService,) { }
  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
}

publishToCloud() {
  this.showPublishToCloudSpinner = true;
  this.itemConversionService.publishToCloud(this.selectedRowData).subscribe(res => {
  this.itemConversionService.requeryItemConvDetails();
  this.showPublishToCloudSpinner = false;
  })
}

itemClassConfirmUpload() {
  this.itemConfirmUpload = true;
}

udaConfigConfirm() {
  this.udaConfigConfirmUpload = true;
}

closeSpets() {
  this.closeChanged.emit(this.isClose);
}
}
