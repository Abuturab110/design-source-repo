import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import { DsoInfoCardComponent } from './dso-info-card/dso-info-card.component';
import { ChartsModule } from 'ng2-charts';
import { DsoPieChartComponent } from './dso-pie-chart/dso-pie-chart.component';
import { DsoLineChartComponent } from './dso-line-chart/dso-line-chart.component';
import { DsoDynamicTableComponent } from './dso-dynamic-table/dso-dynamic-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DsoAssetCardComponent } from './dso-asset-card/dso-asset-card.component';
import { AppRoutingModule } from '../app-routing.module';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldControl, MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { DsoCustomDialogComponent } from './dso-custom-dialog/dso-custom-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { DsoCustomDeleteDialogComponent } from './dso-custom-delete-dialog/dso-custom-delete-dialog.component';
import { DsoUploadDialogComponent } from './dso-upload-dialog/dso-upload-dialog.component';
import { DsoStepperComponent } from './dso-stepper/dso-stepper.component';
import {MatStepperModule} from '@angular/material/stepper';
import { DsoCustomDialogStepperComponent } from './dso-custom-dialog-stepper/dso-custom-dialog-stepper.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [DsoInfoCardComponent, DsoPieChartComponent, DsoLineChartComponent,
     DsoDynamicTableComponent, DsoAssetCardComponent, DsoCustomDialogComponent, DsoCustomDeleteDialogComponent, DsoUploadDialogComponent,
     DsoStepperComponent,DsoCustomDialogStepperComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    ChartsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    AppRoutingModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatStepperModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
  ],
  exports: [DsoInfoCardComponent, DsoPieChartComponent,DsoLineChartComponent, DsoDynamicTableComponent,
     DsoAssetCardComponent, DsoCustomDialogComponent, DsoCustomDeleteDialogComponent,DsoStepperComponent,DsoCustomDialogStepperComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
