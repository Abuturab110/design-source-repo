import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {  BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UdaConvService {
requeryUdaConvData = new BehaviorSubject('');
requeryUdaConvDataObs = this.requeryUdaConvData.asObservable();
  constructor(private _http: HttpClient) { }

  getUdaMappingResultSet(pageInfo :any) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('pageIndex', pageInfo.pageIndex);
    httpParams = httpParams.append('pageLength', pageInfo.pageSize);
    return this._http.get('/api/udaConv/getUdaConvDetails', {
      params: httpParams});
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

  postFile(fileToUpload: File) {
    const endpoint = '/api/udaConv/uploadUdaMappings';
    const formData: FormData = new FormData();
    formData.append('upload', fileToUpload, fileToUpload.name);
    return this._http.post(endpoint, formData);
  }

  getItemConvHomeConfig() {
    return this._http.get('/api/udaConv/getUdaSetupHome');
}
}
