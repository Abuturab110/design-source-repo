import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-uda-setup',
  templateUrl: './uda-setup.component.html',
  styleUrls: ['./uda-setup.component.scss']
})
export class UdaSetupComponent implements OnInit {
  resultSet;
  config;
  files;
  filterValue: string = '';
  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.resultSet = this.dashboardService.getUdaMappingResultSet();
    this.files = [];
    this.config = this.dashboardService.getUdaMappingConfig();
  }

}
