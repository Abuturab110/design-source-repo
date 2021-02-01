import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';

@Component({
  selector: 'app-dso-pie-chart',
  templateUrl: './dso-pie-chart.component.html',
  styleUrls: ['./dso-pie-chart.component.scss']
})
export class DsoPieChartComponent implements OnInit {

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: true,
      position: 'bottom',
      align: 'start',
      labels: {
        padding: 30,
        usePointStyle: true
      },
   }
  };
  public pieChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
  public pieChartData: SingleDataSet = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor() { }

  ngOnInit() {
  }

}
