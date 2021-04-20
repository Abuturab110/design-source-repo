import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType,  } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-dso-line-chart',
  templateUrl: './dso-line-chart.component.html',
  styleUrls: ['./dso-line-chart.component.scss']
})
export class DsoLineChartComponent implements OnInit, OnChanges {
@Input()
lineDetails;
  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
      legend: {
          display: true,
          position: 'bottom',
          align: 'start',
          labels: {
            padding: 30,
            usePointStyle: true
          },
       },
       scales: {
         xAxes: [
           {
              gridLines: {
                   display: false
               }
           }
         ],
         yAxes: [
           {
             gridLines: {
               borderDash: [3]
             }
           }
         ]
           
         }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: '#1DC7EA',
       backgroundColor: 'rgba(29,199,234,0)',
    },
    {
      borderColor: '#FB404B',
       backgroundColor: 'rgba(255,255,255,0.3)',
    },
    {
      borderColor: '#FFA534',
      backgroundColor: 'rgba(255,255,255,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.lineDetails) {
    this.lineChartData = this.lineDetails['chart-data'];
    this.lineChartLabels = this.lineDetails['label'];
    }
  }

}
