import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs/operators';
import { SetupService } from '../../services/setup.service';
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
  constructor(private setupService: SetupService) { }

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
   });
  }

  updateFtpDetails(event) {
    this.setupService.putFtpServerData(event).subscribe(res => {
      this.setupService.requeryFTPServerDetails();
    });

  }

  submitCloudDetails(event) {
     this.setupService.postCloudServerData(event).subscribe(res => {
      this.setupService.requeryCloudServerDetails();
    });
  }

  updateCloudDetails(event) {
    this.setupService.putCloudServerData(event).subscribe(res => {
      this.setupService.requeryCloudServerDetails();
    });
  }
}
