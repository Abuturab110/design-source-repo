import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType,  } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-dso-line-chart',
  templateUrl: './dso-line-chart.component.html',
  styleUrls: ['./dso-line-chart.component.scss']
})
export class DsoLineChartComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [
    { data: [287, 385, 490, 492, 554, 586, 698, 695], label: 'Series A' },
    { data: [67, 152, 143, 240, 287, 335, 435, 437], label: 'Series B' },
    { data: [23, 113, 67, 108, 190, 239, 307, 308], label: 'Series C' },
  ];
  public lineChartLabels: Label[] = ["9:00AM","12:00AM","3:00PM","6:00PM","9:00PM","12:00PM","3:00AM","6:00AM"];
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

}
