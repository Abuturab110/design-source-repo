import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dso-asset-card',
  templateUrl: './dso-asset-card.component.html',
  styleUrls: ['./dso-asset-card.component.scss']
})
export class DsoAssetCardComponent implements OnInit {
@Input('cardData')
data;
  constructor() { }

  ngOnInit(): void {
  }

}
