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
link: 'itemConv',
'user-guide': 'Item Converion User Guide.pdf',
'conversion-configuration': 'Item Conversion Configuration.zip'
},
{
category: 'UDA Setup',
subcategory: 'UDA Setup',
link: 'udaSetup',
'user-guide': 'UDA Setup User Guide.pdf',
'conversion-configuration': 'UDA Setup Configuration.zip'
},
{
category: 'Item Class Conversion',
subcategory: 'Convert Item Classes',
link: 'itemClassConv',
'user-guide': 'Item Class Converion User Guide.pdf',
'conversion-configuration': 'Item Class Conversion Configuration.zip'
}
]
  constructor() { }

  ngOnInit(): void {
  }

}
