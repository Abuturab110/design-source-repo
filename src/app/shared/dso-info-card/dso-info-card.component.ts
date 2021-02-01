import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dso-info-card',
  templateUrl: './dso-info-card.component.html',
  styleUrls: ['./dso-info-card.component.scss']
})
export class DsoInfoCardComponent implements OnInit {
@Input()
cardData: any;
  constructor() { }

  ngOnInit(): void {
  }

}
