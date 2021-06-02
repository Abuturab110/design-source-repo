import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label, SingleDataSet,Color } from 'ng2-charts';


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
  
  public pieChartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255,255,255,0.3)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(54, 162, 235, 1)',
      ],
      borderWidth: 2,
    },
  ];

 
  constructor() { }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.pieDetails) {
     this.pieChartLabels = this.pieDetails['label'];
     this.pieChartData = this.pieDetails['label-count'];
    }
  }

}
