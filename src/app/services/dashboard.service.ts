import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private _http: HttpClient) { }

  getDashboardResultSet(pageInfo :any) {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('pageIndex', pageInfo.pageIndex);
    httpParams = httpParams.append('pageLength', pageInfo.pageLength);
    return this._http.get('/api/dashboardDetails/getRecentRuns', {params: httpParams});
  }

  getDashboardConfig() {
    return this._http.get('assets/dashboard-config.json');
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

  getCardDetails() {
    return this._http.get('/api/dashboardDetails/getCardDetails');
  }

  getPieDetails() {
    return this._http.get('/api/dashboardDetails/pieDetails');
  }

  getLineDetails() {
    return this._http.get('/api/dashboardDetails/lineDetails');
  }
}
