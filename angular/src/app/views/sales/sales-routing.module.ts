import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesOrderListComponent } from './sales-order-list/sales-order-list.component';
import { AddSalesOrderComponent } from './add-sales-order/add-sales-order.component';
import { EditDeleteSalesOrderComponent } from './edit-delete-sales-order/edit-delete-sales-order.component';

const routes: Routes = [
  {
    path: '',
    component: SalesOrderListComponent,
    data: {
      title: 'Sales Order',
    },
  },
  {
    path: 'add',
    component: AddSalesOrderComponent,
    data: {
      title: 'Add Sales Order',
    },
  },
  {
    path: 'edit/:id',
    component: EditDeleteSalesOrderComponent,
    data: {
      title: 'Edit Sales Order',
    },
  },
  {
    path: 'delete/:id',
    component: EditDeleteSalesOrderComponent,
    data: {
      title: 'Delete Sales Order',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
