import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SetupService {
requeryFtpServerData = new BehaviorSubject('');
requeryFtpServerDataObs = this.requeryFtpServerData.asObservable();
requeryCloudServerData = new BehaviorSubject('');
requeryCloudServerDataObs = this.requeryCloudServerData.asObservable();
  constructor(private _http: HttpClient) { }

  getFtpServerConfig() {
    return this._http.get('assets/ftp-server-setup-config.json');
  }

  getFtpServerData() {
    return this._http.get('/api/setup/getFtpServerDetails');
  }

  getCloudServerConfig() {
    return this._http.get('assets/cloud-server-config.json');
  }

  getCloudServerData() {
    return this._http.get('/api/setup/getCloudServerDetails');
  }

  requeryFTPServerDetails() {
    this.requeryFtpServerData.next('');
  }

  postFtpServerData(event) {
    return this._http.post('/api/setup/postFtpServerDetails', event);
  }

  putFtpServerData(event) {
    return this._http.put('/api/setup/putFtpServerDetails', event);
  }

  deleteFtpServerData(event) {
    return this._http.delete('/api/setup/deleteFtpServerDetails/' + event['_id']);
  }

  postCloudServerData(event) {
    return this._http.post('/api/setup/postCloudServerDetails', event);
  }

  putCloudServerData(event) {
    return this._http.put('/api/setup/putCloudServerDetails', event);
  }

  deleteCloudServerData(event) {
    return this._http.delete('/api/setup/deleteCloudServerDetails/'  + event['_id']);
  }

  requeryCloudServerDetails() {
    this.requeryCloudServerData.next('');
  }
}
