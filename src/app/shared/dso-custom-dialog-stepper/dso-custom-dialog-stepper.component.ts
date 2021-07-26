import { Component, OnChanges, OnInit, Inject} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import { ItemConversionService } from '../../services/item-conversion.service';

@Component({
  selector: 'app-dso-custom-dialog-stepper',
  templateUrl: './dso-custom-dialog-stepper.component.html',
  styleUrls: ['./dso-custom-dialog-stepper.component.scss']
})
export class DsoCustomDialogStepperComponent implements OnInit{
  form: FormGroup = this.formBuilder.group({});
  header = 'Item Class Conversion Files';
  itemConfirmUpload = false;
  isItemClassUploadConfirmed = false;
  isUDAUploadConfirmed = false;
  isItemCatalogUploadConfirmed = false;
  step = 1;
  publishData = {};
  instance = '';
  showCatalogPublishSpinner = false;
  showItemPublishSpinner = false;
   constructor(@Inject(MAT_DIALOG_DATA) public data: any ,private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DsoCustomDialogStepperComponent>, private itemConversionService: ItemConversionService ) { 
      console.log(data)
      this.publishData = data.selectedRow;
      this.instance = data.selectedInstance;
      }

  ngOnInit(): void {}

  save() {
    console.log(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

  downloadFile(event) {
    this.itemConversionService.downloadFileFromServer(event.target.innerText);
  }

   publishToCloud() {
    
    this.showItemPublishSpinner = true;
    this.itemConversionService.publishToCloud(this.publishData, this.instance).subscribe(res => {
    this.itemConversionService.requeryItemConvDetails();
    this.showItemPublishSpinner = false;
    console.log(res);
    },
    error => {
      console.log(error);
      this.showItemPublishSpinner = false;
    })
  }

  publishCatalog() {
    this.showCatalogPublishSpinner = true;
    this.itemConversionService.publishCatalog(this.publishData, this.instance).subscribe(result => {
      console.log(result);
      this.showCatalogPublishSpinner = false;
    },
    error => {
      console.log(error);
      this.showCatalogPublishSpinner = false;
    })
  }

}
