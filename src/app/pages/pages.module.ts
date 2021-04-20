import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { ItemConversionComponent } from './item-conversion/item-conversion.component';
import { UdaSetupComponent } from './uda-setup/uda-setup.component';
import { ItemClassConversionComponent } from './item-class-conversion/item-class-conversion.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SetupComponent } from './setup/setup.component';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBarModule} from '@angular/material/snack-bar';



@NgModule({
  declarations: [DashboardComponent, HomeComponent, ItemConversionComponent, UdaSetupComponent, ItemClassConversionComponent, SetupComponent],
  imports: [
    CommonModule,
    SharedModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatSnackBarModule,
  ],
  exports: [ DashboardComponent, HomeComponent, ItemConversionComponent, UdaSetupComponent, ItemClassConversionComponent, SetupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PagesModule { }
