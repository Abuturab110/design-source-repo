import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemClassConversionService {
  requeryItemConvClassData = new BehaviorSubject('');
  requeryItemConvDataObs = this.requeryItemConvClassData.asObservable();
  constructor(private _http: HttpClient) { }
   
  getItemConvClassHomeConfig() {
    return this._http.get('/api/itemConv/getItemClassConvHome');
}
  requeryItemConvClassDetails() {
    this.requeryItemConvClassData.next('');
  }
}
