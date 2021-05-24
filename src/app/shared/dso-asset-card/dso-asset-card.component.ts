import { Component, Input, OnInit } from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ItemClassConversionService } from 'src/app/services/item-class-conversion.service';
import { ItemConversionService } from 'src/app/services/item-conversion.service';
import { UdaConvService } from 'src/app/services/uda-conv.service';

@Component({
  selector: 'app-dso-asset-card',
  templateUrl: './dso-asset-card.component.html',
  styleUrls: ['./dso-asset-card.component.scss']
})
export class DsoAssetCardComponent implements OnInit {
  resultSet;
  panelOpenState = false;
@Input('cardData')
data;
  constructor(private itemConversionService: ItemConversionService,private udaConvService: UdaConvService,
    private  itemClassConversionService :ItemClassConversionService) { }

  ngOnInit(): void {
    this.loadConfigContent(this.data);
    }

  loadConfigContent(data: any) {
    if(data.category == "Item Conversion"){
       this.resultSet = this.itemConversionService.requeryItemConvHomeDataObs.pipe(
      debounceTime(200),
      switchMap(res => this.itemConversionService.getItemConvHomeConfig())
    );
    }
    if(data.category== "UDA Setup"){
       this.resultSet = this.udaConvService.requeryUdaConvDataObs.pipe(
      debounceTime(200),
      switchMap(res => this.udaConvService.getItemConvHomeConfig())
    );
    }
    if(data.category == "Item Class Conversion"){
      this.resultSet = this.itemClassConversionService.requeryItemConvDataObs.pipe(
        debounceTime(200),
        switchMap(res => this.itemClassConversionService.getItemConvClassHomeConfig())
      );
    }
  }
}
