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
  cards = [
    {
      info: 'Total Runs',
      value: 105,
      "img-src": 'transaction-runs.png' 
    },
    {
      info: 'Transactions Total',
      value: 1354,
      "img-src": 'transaction-count.png' 
    },
    {
      info: 'Transactions Success',
      value: 1345,
      "img-src": 'transaction-success.png' 
    },
    {
      info: 'Transactions Errors',
      value: 23,
      "img-src": 'transaction-error.png' 
    }
  ];
  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    console.log('In OnInit');
    this.resultSet = this.dashboardService.getDashboardResultSet();
    this.config = this.dashboardService.getDashboardConfig();
  }

}
