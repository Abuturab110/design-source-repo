import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private _http: HttpClient) { }

  getDashboardResultSet() {
  return this._http.get('assets/dashboard-result-set.json');
  }

  getDashboardConfig() {
    return this._http.get('assets/dashboard-config.json');
    }

  getItemConvResultSet() {
    return this._http.get('/api/itemConv/getItemConvDetails');
  }

  getItemConvConfig() {
    return this._http.get('assets/item-conv-config.json');
  }

  getUdaMappingResultSet() {
    return this._http.get('assets/uda-mapping-result-set.json');
  }

  getUdaMappingConfig() {
    return this._http.get('assets/uda-mapping-config.json');
  }

  getFiles(ftpName: string): Observable<any> {
    
    return this._http.get('/api/dashboard/itemConvRefreshFiles/'+ftpName);
  }

  getEnvironments(): Observable<any> {
    return this._http.get('/api/dashboard/getFtpDetails');
  }

}
