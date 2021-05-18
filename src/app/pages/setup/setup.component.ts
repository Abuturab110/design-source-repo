import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { SetupService } from '../../services/setup.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Constants } from 'src/app/shared/constant.component';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  hide = true;
  ftpServerConfig: any;
  ftpServerData: any;
  cloudServerConfig: any;
  cloudServerData: any;
  unsPscSgmentConfig: any;
  unsPscFamilyConfig: any;
  unsPscClassConfig: any;
  unsPscCommodityConfig: any;
  unspscSegmentData:any;
  unspscFamilyData:any;
  unspscClassData:any;
  unspscCommoditytData:any;
  constructor(private setupService: SetupService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.ftpServerConfig = this.setupService.getFtpServerConfig();
    this.ftpServerData = this.setupService.requeryFtpServerDataObs.pipe(
      debounceTime(200),
      switchMap(res => this.setupService.getFtpServerData())
    );

    this.cloudServerConfig = this.setupService.getCloudServerConfig();
    this.cloudServerData = this.setupService.requeryCloudServerDataObs.pipe(
      debounceTime(200),
      switchMap(res => this.setupService.getCloudServerData())
    );
    this.unsPscSgmentConfig = this.setupService.getUnspscSegmentMappingConfig();
    
    this.unspscSegmentData = this.setupService.requeryUnspscDataObs.pipe(
      debounceTime(200),
      switchMap(res => this.setupService.getUnspscSegmentData())
    );
    this.unsPscFamilyConfig = this.setupService.getUnspscFamilyMappingConfig();
    this.unspscFamilyData = this.setupService.requeryUnspscDataObs.pipe(
      debounceTime(200),
      switchMap(res => this.setupService.getUnspscFamilyData())
    );
    this.unsPscClassConfig = this.setupService.getUnspscClassMappingConfig();
    this.unspscClassData = this.setupService.requeryUnspscDataObs.pipe(
      debounceTime(200),
      switchMap(res => this.setupService.getUnspscClassData())
    );

    this.unsPscCommodityConfig = this.setupService.getUnspscCommodityMappingConfig();
    this.unspscCommoditytData = this.setupService.requeryUnspscDataObs.pipe(
      debounceTime(200),
      switchMap(res => this.setupService.getUnspscCommodityData())
    );

  }

  submitFtpDetails(event) {
   this.setupService.postFtpServerData(event).subscribe(res => {
     this.setupService.requeryFTPServerDetails();
     this._snackBar.open(Constants.ftpSetupSave,null, {
      duration: 2000
    });
   });
  }

  updateFtpDetails(event) {
    this.setupService.putFtpServerData(event).subscribe(res => {
      this.setupService.requeryFTPServerDetails();
      this._snackBar.open(Constants.ftpSetupUpdate,null, {
        duration: 2000
      });
    });
  }

  deleteFtpDetails(event) {
    console.log(event);
    this.setupService.deleteFtpServerData(event).subscribe(res => {
      this.setupService.requeryFTPServerDetails();
      this._snackBar.open(Constants.ftpSetupDelete,null, {
        duration: 2000
      });
    });
  }

  submitCloudDetails(event) {
    this.setupService.postCloudServerData(event).subscribe(res => {
    this.setupService.requeryCloudServerDetails();
    this._snackBar.open(Constants.cloudInstanceSave,null, {
      duration: 2000
    });
    });
  }

  updateCloudDetails(event) {
    this.setupService.putCloudServerData(event).subscribe(res => {
      this.setupService.requeryCloudServerDetails();
      this._snackBar.open(Constants.cloudInstanceUpdate,null, {
        duration: 2000
      });
    });
  }

  deleteCloudDetails(event) {
    this.setupService.deleteCloudServerData(event).subscribe(res => {
      this.setupService.requeryCloudServerDetails();
      this._snackBar.open(Constants.cloudInstanceDelete,null, {
        duration: 2000
      });
    });
  }

  submitUnspscSegment(event) {
    this.setupService.postUnspscSegment(event).subscribe(res => {
    this.setupService.requeryUnspscDetails();
    this._snackBar.open(Constants.cloudInstanceSave,null, {
      duration: 2000
    });
    });
  }

  updateUnspscSegment(event) {
    this.setupService.putUnspscSegment(event).subscribe(res => {
      this.setupService.requeryUnspscDetails();
      this._snackBar.open(Constants.cloudInstanceUpdate,null, {
        duration: 2000
      });
    });
  }

  deleteUnspscSegment(event) {
    this.setupService.deleteUnspscSegment(event).subscribe(res => {
      this.setupService.requeryUnspscDetails();
      this._snackBar.open(Constants.cloudInstanceDelete,null, {
        duration: 2000
      });
    });
  }
  submitUnspscFamily(event) {
    this.setupService.postUnspscFamily(event).subscribe(res => {
    this.setupService.requeryUnspscDetails();
    this._snackBar.open(Constants.cloudInstanceSave,null, {
      duration: 2000
    });
    });
  }
  updateUnspscFamily(event) {
    this.setupService.putUnspscFamily(event).subscribe(res => {
      this.setupService.requeryUnspscDetails();
      this._snackBar.open(Constants.cloudInstanceUpdate,null, {
        duration: 2000
      });
    });
  }

  deleteUnspscFamily(event) {
    this.setupService.deleteUnspscFamily(event).subscribe(res => {
      this.setupService.requeryUnspscDetails();
      this._snackBar.open(Constants.cloudInstanceDelete,null, {
        duration: 2000
      });
    });
  }

  submitUnspscClass(event) {
    this.setupService.postUnspscClass(event).subscribe(res => {
    this.setupService.requeryUnspscDetails();
    this._snackBar.open(Constants.cloudInstanceSave,null, {
      duration: 2000
    });
    });
  }

  updateUnspscClass(event) {
    this.setupService.putUnspscClass(event).subscribe(res => {
      this.setupService.requeryUnspscDetails();
      this._snackBar.open(Constants.cloudInstanceUpdate,null, {
        duration: 2000
      });
    });
  }

  deleteUnspscClass(event) {
    this.setupService.deleteUnspscClass(event).subscribe(res => {
      this.setupService.requeryUnspscDetails();
      this._snackBar.open(Constants.cloudInstanceDelete,null, {
        duration: 2000
      });
    });
  }


  submitUnspscCommodity(event) {
    this.setupService.postUnspscCommodity(event).subscribe(res => {
    this.setupService.requeryUnspscDetails();
    this._snackBar.open(Constants.cloudInstanceSave,null, {
      duration: 2000
    });
    });
  }

  updateUnspscCommodity(event) {
    this.setupService.putUnspscCommodity(event).subscribe(res => {
      this.setupService.requeryUnspscDetails();
      this._snackBar.open(Constants.cloudInstanceUpdate,null, {
        duration: 2000
      });
    });
  }

  deleteUnspscCommodity(event) {
    this.setupService.deleteUnspscCommodity(event).subscribe(res => {
      this.setupService.requeryUnspscDetails();
      this._snackBar.open(Constants.cloudInstanceDelete,null, {
        duration: 2000
      });
    });
  }


  uploadUnspscDetails(event) {
    this.setupService.postFile(event).subscribe(res => {
      this.setupService.requeryUnspscDetails();
     this._snackBar.open(Constants.udaUpload,null, {
       duration: 2000
     });
    });
  }
}
