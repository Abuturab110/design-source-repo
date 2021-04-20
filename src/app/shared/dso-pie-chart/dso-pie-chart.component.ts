import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet } from 'ng2-charts';

@Component({
  selector: 'app-dso-pie-chart',
  templateUrl: './dso-pie-chart.component.html',
  styleUrls: ['./dso-pie-chart.component.scss']
})
export class DsoPieChartComponent implements OnInit, OnChanges {
@Input()
pieDetails;
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
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
 
  constructor() { }

  ngOnInit() {

  }

  ngOnChanges() {
    console.log(this.pieDetails);
    if (this.pieDetails) {
     this.pieChartLabels = this.pieDetails['label'];
     this.pieChartData = this.pieDetails['label-count'];
    }
  }

}
