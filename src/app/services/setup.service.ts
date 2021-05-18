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
requeryUnspscData = new BehaviorSubject('');
requeryUnspscDataObs = this.requeryUnspscData.asObservable();

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

  getUnspscSegmentData() {
    return this._http.get('/api/setup/getUnspscSegmentDetails');
  }
  getUnspscFamilyData() {
    return this._http.get('/api/setup/getUnspscFamilyDetails');
  }

  getUnspscClassData() {
    return this._http.get('/api/setup/getUnspscClassDetails');
  }

  getUnspscCommodityData() {
    return this._http.get('/api/setup/getUnspscCommodityDetails');
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

  postUnspscSegment(event) {
    return this._http.post('/api/setup/postUnspscSegment', event);
  }

  putUnspscSegment(event) {
    return this._http.put('/api/setup/putUnspscSegment', event);
  }

  deleteUnspscSegment(event) {
    return this._http.delete('/api/setup/deleteUnspscSegment/'  + event['_id']);
  }


  postUnspscFamily(event) {
    return this._http.post('/api/setup/postUnspscFamily', event);
  }

  putUnspscFamily(event) {
    return this._http.put('/api/setup/putUnspscFamily', event);
  }

  deleteUnspscFamily(event) {
    return this._http.delete('/api/setup/deleteUnspscFamily/'  + event['_id']);
  }

  postUnspscClass(event) {
    return this._http.post('/api/setup/postUnspscClass', event);
  }

  putUnspscClass(event) {
    return this._http.put('/api/setup/putUnspscClass', event);
  }

  deleteUnspscClass(event) {
    return this._http.delete('/api/setup/deleteUnspscClass/'  + event['_id']);
  }

  postUnspscCommodity(event) {
    return this._http.post('/api/setup/postUnspscCommodity', event);
  }

  putUnspscCommodity(event) {
    return this._http.put('/api/setup/putUnspscCommodity', event);
  }

  deleteUnspscCommodity(event) {
    return this._http.delete('/api/setup/deleteUnspscCommodity/'  + event['_id']);
  }

  requeryCloudServerDetails() {
    this.requeryCloudServerData.next('');
  }

  requeryUnspscDetails() {
    this.requeryUnspscData.next('');
  }


  getUnspscSegmentMappingConfig() {
    return this._http.get('assets/unspsc-segment-mapping-config.json');
  }

  getUnspscFamilyMappingConfig() {
    return this._http.get('assets/unspsc-family-mapping-config.json');
  }

  getUnspscClassMappingConfig() {
    return this._http.get('assets/unspsc-class-mapping-config.json');
  }

  getUnspscCommodityMappingConfig() {
    return this._http.get('assets/unspsc-commodity-mapping-config.json');
  }

  postFile(fileToUpload: File) {
    const endpoint = '/api/setup/uploadUnspscMappings';
    const formData: FormData = new FormData();
    formData.append('upload', fileToUpload, fileToUpload.name);
    return this._http.post(endpoint, formData);
  }
}
