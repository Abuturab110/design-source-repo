import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UdaConvService {
requeryUdaConvData = new BehaviorSubject('');
requeryUdaConvDataObs = this.requeryUdaConvData.asObservable();
  constructor(private _http: HttpClient) { }

  getUdaMappingResultSet() {
    return this._http.get('/api/udaConv/getUdaConvDetails');
  }

  getUdaMappingConfig() {
    return this._http.get('assets/uda-mapping-config.json');
  }

  postUdaMappingData(event) {
    return this._http.post('/api/udaConv/postUdaConvDetails', event);
  }

  putUdaMappingData(event) {
    return this._http.put('/api/udaConv/putUdaConvDetails', event);
  }

  deleteUdaMappingData(event) {
    return this._http.delete('/api/udaConv/deleteUdaConvDetails/' + event['_id']);
  }

  requeryUdaConvDetails() {
    this.requeryUdaConvData.next('');
  }


}
