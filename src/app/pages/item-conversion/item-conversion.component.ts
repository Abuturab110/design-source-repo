import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { tap } from 'rxjs/operators';

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
  fileSelect:any;
  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.resultSet = this.dashboardService.getItemConvResultSet();
    this.environments = this.dashboardService.getEnvironments();
    this.config = this.dashboardService.getItemConvConfig();
  }

  // async selected(event) {
  //   console.log(event);

  //   console.log('dscds'+this.fileSelect);
  // }

  refreshFiles() {
   
    if(this.selectedEnvironment) {
      this.showSpinner = true;
      this.files=this.dashboardService.getFiles(this.selectedEnvironment).pipe(
      tap(() => this.showSpinner = false)
    );

    }
  }

  async generateFBDI(){
    console.log('selected file is : '+this.fileSelect);

    await this.dashboardService.getGenerateFBDI(this.fileSelect).subscribe();
  }
}
