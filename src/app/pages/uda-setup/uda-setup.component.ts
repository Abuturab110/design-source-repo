import { Component, OnInit } from '@angular/core';
import { debounceTime, switchMap} from 'rxjs/operators';
import { UdaConvService } from 'src/app/services/uda-conv.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-uda-setup',
  templateUrl: './uda-setup.component.html',
  styleUrls: ['./uda-setup.component.scss']
})
export class UdaSetupComponent implements OnInit {
  resultSet;
  config;
  filterValue: string = '';
  constructor(private udaConvService: UdaConvService, 
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.resultSet = this.udaConvService.requeryUdaConvDataObs.pipe(
      debounceTime(200),
      switchMap(res => this.udaConvService.getUdaMappingResultSet())
    );
    this.config = this.udaConvService.getUdaMappingConfig();
  }


  submitUdaConvDetails(event) {
    this.udaConvService.postUdaMappingData(event).subscribe(res => {
      this.udaConvService.requeryUdaConvDetails();
    });
  }

  updateUdaConvDetails(event) {
    this.udaConvService.putUdaMappingData(event).subscribe(res => {
      this.udaConvService.requeryUdaConvDetails();
    });
  }

  deleteUdaConvDetails(event) {
    this.udaConvService.deleteUdaMappingData(event).subscribe(res => {
      this.udaConvService.requeryUdaConvDetails();
    });
  }

  uploadUdaConvDetails(event) {
    this.udaConvService.postFile(event).subscribe(res => {
      this.udaConvService.requeryUdaConvDetails();
     this._snackBar.open('UDA Mappings successfully uploaded',null, {
       duration: 2000
     });
    });
  }
}
