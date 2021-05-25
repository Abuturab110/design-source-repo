import { Component, OnInit } from '@angular/core';
import { debounceTime, switchMap} from 'rxjs/operators';
import { UdaConvService } from 'src/app/services/uda-conv.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Constants } from 'src/app/shared/constant.component';

@Component({
  selector: 'app-uda-setup',
  templateUrl: './uda-setup.component.html',
  styleUrls: ['./uda-setup.component.scss']
})
export class UdaSetupComponent implements OnInit {
  resultSet;
  config;
  filterValue: string = '';
  pageInfo = { "pageIndex": 0,"pageLength": 5 } ;
  constructor(private udaConvService: UdaConvService, 
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getUdaMappingResultSet()
    this.config = this.udaConvService.getUdaMappingConfig();
  }


  submitUdaConvDetails(event) {
    this.udaConvService.postUdaMappingData(event).subscribe(res => {
      this.udaConvService.requeryUdaConvDetails();
      this._snackBar.open(Constants.udaSave,null, {
        duration: 2000
      });
    });
  }

  updateUdaConvDetails(event) {
    this.udaConvService.putUdaMappingData(event).subscribe(res => {
      this.udaConvService.requeryUdaConvDetails();
      this._snackBar.open(Constants.udaUpdate,null, {
        duration: 2000
      });
    });
  }

  deleteUdaConvDetails(event) {
    this.udaConvService.deleteUdaMappingData(event).subscribe(res => {
      this.udaConvService.requeryUdaConvDetails();
      this._snackBar.open(Constants.udaDelete,null, {
        duration: 2000
      });
    });
  }

  uploadUdaConvDetails(event) {
    this.udaConvService.postFile(event).subscribe(res => {
      this.udaConvService.requeryUdaConvDetails();
     this._snackBar.open(Constants.udaUpload,null, {
       duration: 2000
     });
    });
  }
  getUdaMappingResultSet(){
    this.resultSet = this.udaConvService.requeryUdaConvDataObs.pipe(
      debounceTime(200),
      switchMap(res => this.udaConvService.getUdaMappingResultSet(this.pageInfo))
    );
  }
  pageChanged(event){
    this.resultSet = [];
    this.pageInfo.pageIndex = event.pageIndex;
    this.getUdaMappingResultSet();
  }
}
