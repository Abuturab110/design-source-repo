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

  getItemConvResultSet(pageInfo : any) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('pageIndex', pageInfo.pageIndex);
    httpParams = httpParams.append('pageSize', pageInfo.pageSize);
    return this._http.get('/api/itemConv/getItemConvDetails',{params: httpParams});
  }

  generateFBDI(environment, fileName) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('environment', environment);
    httpParams = httpParams.append('filename', fileName);
    return this._http.get('/api/itemConv/createFBDI',{
      params: httpParams
    }).pipe(
      debounceTime(200),
      switchMap(res => this._http.post('/api/itemConv/insertItemConvDetails', {run: res['run'], fbdi: res['fbdi'], count: res['count']}),)
    );
   }

  requeryItemConvDetails() {
    this.requeryItemConvData.next('');
  }

  requeryItemConvHomeDetails() {
    this.requeryItemConvHomeData.next('');
  }

  publishToCloud(row: any) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('filename', row.cloudInstanceName);
    httpParams = httpParams.append('username', row.userName);
    httpParams = httpParams.append('password', row.password);
    httpParams = httpParams.append('cloudInstanceLink', row.cloudInstanceLink);
    return this._http.get('/api/itemConv/publishToCloud', {
      params: httpParams
    }).pipe(
      debounceTime(200),
      switchMap(res => this._http.put('/api/itemConv/putItemConvDetails', {...row, 'last-update-date': new Date().toString(), 'request-id': res['ReqstId'], 'cloud-process-status': 'Submitted'}))
    );
  }

  getItemConvHomeConfig() {
       return this._http.get('/api/itemConv/getItemConvHomeDetails');
  }
}
