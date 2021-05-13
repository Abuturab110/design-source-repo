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
}
