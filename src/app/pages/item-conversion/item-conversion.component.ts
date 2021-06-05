import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { catchError, tap, timeout } from 'rxjs/operators';
import { ItemConversionService } from '../../services/item-conversion.service';
import {switchMap, debounceTime} from 'rxjs/operators';

import {MatDialog,MatDialogConfig} from '@angular/material/dialog';
import { DsoCustomDialogStepperComponent } from 'src/app/shared/dso-custom-dialog-stepper/dso-custom-dialog-stepper.component';

import { SetupService } from '../../services/setup.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-item-conversion',
  templateUrl: './item-conversion.component.html',
  styleUrls: ['./item-conversion.component.scss']
})
export class ItemConversionComponent implements OnInit {
  resultSet;
  config;
  files;
  environments;
  selectedEnvironment;
  showSpinner = false;
  showFBDISpinner = false;
  showPublishToCloudSpinner = false;
  selectedFile;
  selectedRowData;
  cloudSetupData;
  errorMessage;
  showFileList = false;
  constructor(private dashboardService: DashboardService, private setupService: SetupService,
              private itemConversionService: ItemConversionService,private _snackBar: MatSnackBar,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.resultSet = this.itemConversionService.requeryItemConvDataObs.pipe(
      debounceTime(200),
      switchMap(res => this.itemConversionService.getItemConvResultSet())
    );
    this.environments = this.itemConversionService.getEnvironments();
    this.config = this.dashboardService.getItemConvConfig();
    this.cloudSetupData =  this.setupService.getCloudServerForItemConversion();
  }

  refreshFiles() {

    if(this.selectedEnvironment) {
      this.showSpinner = true;
      this.files=this.itemConversionService.getFiles(this.selectedEnvironment).pipe(timeout(20000),
      tap(() => {this.showSpinner = false; this.showFileList = true}),
      catchError((error):any =>  {
        this.showFileList = false; 
        this.showSpinner = false; 
        this._snackBar.open('Timed out while connect with ftp server',null, {
          duration: 4000
        });
      })
    );
  }
  }
   
  generateFBDI() {
        this.showFBDISpinner = true;
        this.itemConversionService.generateFBDI(this.selectedEnvironment, this.selectedFile).subscribe(res => {
        this.itemConversionService.requeryItemConvDetails();
        this.showFBDISpinner = false;
        });
  }

  setRowData(event) {
    this.selectedRowData = event;
  }


  publishToCloud() {
    
    this.showPublishToCloudSpinner = true;
    this.itemConversionService.publishToCloud(this.selectedRowData).subscribe(res => {
    this.itemConversionService.requeryItemConvDetails();
    this.showPublishToCloudSpinner = false;
    })
  }

  openDialog() {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      const dialogRef = this.dialog.open(DsoCustomDialogStepperComponent,dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
       });
  }
 }
