import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FormModule,
  GridModule,
  ListGroupModule,
  PaginationModule,
  ProgressModule,
  SharedModule,
  TableModule,
  ToastModule
} from '@coreui/angular';

import { DocsComponentsModule } from '../../../components/docs-components.module';

import { MasterDataRoutingModule } from './master-data-routing.module';
import { RangesComponent } from './ranges/ranges.component';
import { FloatingLabelsComponent } from './floating-labels/floating-labels.component';
import { BranchListComponent } from './branch/branch-list/branch-list.component';
import { SelectComponent } from './select/select.component';
import { InputGroupsComponent } from './input-groups/input-groups.component';
import { LayoutComponent } from './layout/layout.component';
import { ValidationComponent } from './validation/validation.component';
import { IconModule } from '@coreui/icons-angular';
import { AddBranchComponent } from './branch/add-branch/add-branch.component';
import { BranchDetailsComponent } from './branch/branch-details/branch-details.component';
import { EditBranchComponent } from './branch/edit-branch/edit-branch.component';
import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { CustomerDetailsComponent } from './customer/customer-details/customer-details.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { EditDeleteCustomerComponent } from './customer/edit-delete-customer/edit-delete-customer.component';
import { ProductCategoryListComponent } from './product-category/product-category-list/product-category-list.component';
import { AddProductCategoryComponent } from './product-category/add-product-category/add-product-category.component';
import { EditDeleteProductCategoryComponent } from './product-category/edit-delete-product-category/edit-delete-product-category.component';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { AddCompanyComponent } from './company/add-company/add-company.component';
import { EditDeleteCompanyComponent } from './company/edit-delete-company/edit-delete-company.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { AddProductComponent } from './product/add-product/add-product.component';
import { EditDeleteProductComponent } from './product/edit-delete-product/edit-delete-product.component';
import { SalesOrderStatusListComponent } from './sales-order-status/sales-order-status-list/sales-order-status-list.component';
import { AddSalesOrderStatusComponent } from './sales-order-status/add-sales-order-status/add-sales-order-status.component';
import { EditDeleteSalesOrderStatusComponent } from './sales-order-status/edit-delete-sales-order-status/edit-delete-sales-order-status.component';


@NgModule({
  declarations: [
    RangesComponent,
    FloatingLabelsComponent,
    BranchListComponent,
    SelectComponent,
    CustomerListComponent,
    InputGroupsComponent,
    LayoutComponent,
    ValidationComponent,
    AddBranchComponent,
    BranchDetailsComponent,
    EditBranchComponent,
    AddCustomerComponent,
    CustomerDetailsComponent,
    CustomerListComponent,
    EditDeleteCustomerComponent,
    ProductCategoryListComponent,
    AddProductCategoryComponent,
    EditDeleteProductCategoryComponent,
    CompanyListComponent,
    AddCompanyComponent,
    EditDeleteCompanyComponent,
    ProductListComponent,
    AddProductComponent,
    EditDeleteProductComponent,
    SalesOrderStatusListComponent,
    AddSalesOrderStatusComponent,
    EditDeleteSalesOrderStatusComponent
  ],
  imports: [
    CommonModule,
    MasterDataRoutingModule,
    DocsComponentsModule,
    CardModule,
    IconModule,
    FormModule,
    GridModule,
    ProgressModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FormModule,
    ButtonModule,
    ButtonGroupModule,
    DropdownModule,
    SharedModule,
    AvatarModule,
    TableModule,
    ListGroupModule,
    ToastModule,
    PaginationModule
  ]
})
export class MasterDataModule {
}
