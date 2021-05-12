import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { tap } from 'rxjs/operators';
import { ItemConversionService } from '../../services/item-conversion.service';
import {switchMap, debounceTime} from 'rxjs/operators';
import { SetupService } from '../../services/setup.service';
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
  constructor(private dashboardService: DashboardService, private setupService: SetupService,
              private itemConversionService: ItemConversionService) { }

  ngOnInit(): void {
    this.resultSet = this.itemConversionService.requeryItemConvDataObs.pipe(
      debounceTime(200),
      switchMap(res => this.itemConversionService.getItemConvResultSet())
    );
    this.environments = this.itemConversionService.getEnvironments();
    this.config = this.dashboardService.getItemConvConfig();
    this.cloudSetupData =  this.setupService.getCloudServerData();
  }

  refreshFiles() {
   
    if(this.selectedEnvironment) {
      this.showSpinner = true;
      this.files=this.itemConversionService.getFiles(this.selectedEnvironment).pipe(
      tap(() => this.showSpinner = false)
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
}
