import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { debounce, debounceTime, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemConversionService {
  requeryItemConvData = new BehaviorSubject('');
  requeryItemConvDataObs = this.requeryItemConvData.asObservable();
  requeryItemConvHomeData = new BehaviorSubject('');
  requeryItemConvHomeDataObs = this.requeryItemConvHomeData.asObservable();
  constructor(private _http: HttpClient) { }

  getEnvironments() {
    return this._http.get('/api/itemConv/getFtpDetails');
  }

  getFiles(ftpName: string) {
    return this._http.get('/api/itemConv/itemConvRefreshFiles/'+ftpName);
  }

  getItemConvResultSet() {
    return this._http.get('/api/itemConv/getItemConvDetails');
  }

  generateFBDI(environment, fileName) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('environment', environment);
    httpParams = httpParams.append('filename', fileName);
    return this._http.get('/api/itemConv/createFBDI',{
      params: httpParams
    }).pipe(
      debounceTime(200),
      switchMap(res => this._http.post('/api/itemConv/insertItemConvDetails', {run: res['run'],
                                                                              fbdi: res['fbdi'],
                                                                              'item-class': res['item-class'],
                                                                              'item-family': res['item-family'],
                                                                              'item-segment': res['item-segment'],
                                                                              'uda-conv': res['uda-conv'],
                                                                              'item-catalog': res['item-catalog'],
                                                                              'item-batch-id': res['item-batch-id'],
                                                                              'catalog-batch-id': res['catalog-batch-id'],
                                                                              'total-records': res['total-records'],
                                                                               success: res['success'],
                                                                               error: res['error']}),)
    );
   }

  requeryItemConvDetails() {
    this.requeryItemConvData.next('');
  }

  requeryItemConvHomeDetails() {
    this.requeryItemConvHomeData.next('');
  }

  publishToCloud(row, instance) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('filename', row.fbdi);
    httpParams = httpParams.append('userName', instance.userName);
    httpParams = httpParams.append('password', instance.password);
    httpParams = httpParams.append('cloudInstanceLink', instance.cloudInstanceLink);
    httpParams = httpParams.append('itemBatchId', row['item-batch-id']);
    return this._http.get('/api/itemConv/publishToCloud', {
      params: httpParams
    }).pipe(
      debounceTime(200),
      switchMap(res => this._http.put('/api/itemConv/putItemConvDetails', {...row, 'last-update-date': new Date().toString(), 'request-id': res['ReqstId'], 'cloud-process-status': 'Submitted'}))
    );
  }

  publishCatalog(row, instance) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('filename', row['item-catalog']);
    httpParams = httpParams.append('userName', instance.userName);
    httpParams = httpParams.append('password', instance.password);
    httpParams = httpParams.append('cloudInstanceLink', instance.cloudInstanceLink);
    httpParams = httpParams.append('itemCatalogBatchId', row['catalog-batch-id']);
    return this._http.get('/api/itemConv/publishItemCatalogToCloud', {
      params: httpParams
    })
  }

  getItemConvHomeConfig() {
       return this._http.get('/api/itemConv/getItemConvHomeDetails');
  }

  downloadFileFromServer(filename) {
    window.location.href = window.location.origin + '/' + filename;
  }
}
