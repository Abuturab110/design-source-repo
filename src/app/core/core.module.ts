import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from '../app-routing.module';
import { DsoNavigationToolbarComponent } from './dso-navigation-toolbar/dso-navigation-toolbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { PagesModule } from '../pages/pages.module';


@NgModule({
  declarations: [DsoNavigationToolbarComponent],
  imports: [
    CommonModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    AppRoutingModule,
    PagesModule,
  ],
  exports: [DsoNavigationToolbarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CoreModule { }
