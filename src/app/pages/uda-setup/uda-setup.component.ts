import { Component, OnInit } from '@angular/core';
import { debounceTime, switchMap} from 'rxjs/operators';
import { UdaConvService } from 'src/app/services/uda-conv.service';

@Component({
  selector: 'app-uda-setup',
  templateUrl: './uda-setup.component.html',
  styleUrls: ['./uda-setup.component.scss']
})
export class UdaSetupComponent implements OnInit {
  resultSet;
  config;
  filterValue: string = '';
  constructor(private udaConvService: UdaConvService) { }

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
}
