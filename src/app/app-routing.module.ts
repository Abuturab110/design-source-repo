import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { ItemClassConversionComponent } from './pages/item-class-conversion/item-class-conversion.component';
import { ItemConversionComponent } from './pages/item-conversion/item-conversion.component';
import { ProductCatalogComponent } from './pages/product-catalog/product-catalog.component';
import { SetupComponent } from './pages/setup/setup.component';
import { UdaConfigurationComponent } from './pages/uda-configuration/uda-configuration.component';
import { UdaSetupComponent } from './pages/uda-setup/uda-setup.component';


const routes: Routes = [
{
  path: 'dashboard',
  component: DashboardComponent,
  data: {title: 'Dashboard'}
},
{
  path: 'home',
  component: HomeComponent,
  data: {title: 'Home'}
},
{
  path: 'itemConv',
  component: ItemConversionComponent,
  data: {title: 'Item Conversion'}
},
{
  path: 'udaSetup',
  component: UdaSetupComponent,
  data: {title: 'UDA Setup'}
},
{
  path: 'itemClassConv',
  component: ItemClassConversionComponent,
  data: {title: 'Item Class Conversion'}
},

{
  path: 'productCatalog',
  component: ProductCatalogComponent,
  data: {title: 'Product Catalog'}
},

{
  path: 'udaConfiguration',
  component: UdaConfigurationComponent,
  data: {title: 'UDA Configuration'}
},

{
  path: 'setup',
  component: SetupComponent,
  data: {title: 'Setup'}
},
{
  path: '',
  redirectTo: '/dashboard',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
