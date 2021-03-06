import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
// dashboard pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouteRoutingModule } from './routes-routing.module';

// passport pages
// single pages
import { CallbackComponent } from './callback/callback.component';
import { UserLockComponent } from './passport/lock/lock.component';
import { UserLoginComponent } from './passport/login/login.component';
import { UserRegisterResultComponent } from './passport/register-result/register-result.component';
import { UserRegisterComponent } from './passport/register/register.component';

import { InventionModalComponent } from './blueprint/invention.component';
import { BlueprintListComponent } from './blueprint/list.component';
import { MaterialModalComponent } from './blueprint/material.component';
import { BlueprintModalComponent } from './items/blueprint.component';
import { ItemsListComponent } from './items/list.component';
import { PickListComponent } from './items/pick.component';
import { ProductComponent} from './product/product.component';

const COMPONENTS = [
  DashboardComponent,
  // passport pages
  UserLoginComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  // single pages
  CallbackComponent,
  UserLockComponent,
  ItemsListComponent,
  PickListComponent,
  BlueprintListComponent,
  BlueprintModalComponent,
  MaterialModalComponent,
  InventionModalComponent,
  ProductComponent,
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [ SharedModule, RouteRoutingModule ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
})
export class RoutesModule {}
