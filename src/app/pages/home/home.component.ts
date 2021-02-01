import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
homeData = [
{
category: 'Item Conversion',
subcategory: 'Convert Items',
link: 'itemConv'
},
{
category: 'UDA Setup',
subcategory: 'UDA Setup',
link: 'udaSetup'
},
{
category: 'Item Class Conversion',
subcategory: 'Convert Item Classes',
link: 'itemClassConv'
}
]
  constructor() { }

  ngOnInit(): void {
  }

}
