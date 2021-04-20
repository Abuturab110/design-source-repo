import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  resultSet: any = {};
  config: any = {};
  cards: any = {};
  pieDetails: any = {};
  lineDetails: any = {};
  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.cards = this.dashboardService.getCardDetails();
    this.resultSet = this.dashboardService.getDashboardResultSet();
    this.config = this.dashboardService.getDashboardConfig();
    this.pieDetails = this.dashboardService.getPieDetails();
    this.lineDetails = this.dashboardService.getLineDetails();
  }

}
