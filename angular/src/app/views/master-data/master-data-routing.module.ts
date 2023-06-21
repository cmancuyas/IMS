import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FloatingLabelsComponent } from './floating-labels/floating-labels.component';
import { BranchListComponent } from './branch/branch-list/branch-list.component';
import { InputGroupsComponent } from './input-groups/input-groups.component';
import { RangesComponent } from './ranges/ranges.component';
import { SelectComponent } from './select/select.component';

import { LayoutComponent } from './layout/layout.component';
import { ValidationComponent } from './validation/validation.component';
import { AddBranchComponent } from './branch/add-branch/add-branch.component';
import { EditBranchComponent } from './branch/edit-branch/edit-branch.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { AddCustomerComponent } from './customer/add-customer/add-customer.component';
import { CustomerDetailsComponent } from './customer/customer-details/customer-details.component';
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

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Master Data',
    },
    children: [
      // {
      //   path: '',
      //   pathMatch: 'full',
      //   redirectTo: 'branches',
      // },
      {
        path: 'branches',
        component: BranchListComponent,
        data: {
          title: 'Branches',
        },
      },
      {
        path: 'branch/add',
        component: AddBranchComponent,
        data: {
          title: 'Add Branch',
        },
      },
      {
        path: 'branch/edit/:id',
        component: EditBranchComponent,
        data: {
          title: 'Edit Branch',
        },
      },
      {
        path: 'branch/delete/:id',
        component: EditBranchComponent,
        data: {
          title: 'Delete Branch',
        },
      },

      {
        path: 'companies',
        component: CompanyListComponent,
        data: {
          title: 'Companies',
        },
      },
      {
        path: 'company/add',
        component: AddCompanyComponent,
        data: {
          title: 'Add Company',
        },
      },
      {
        path: 'company/edit/:id',
        component: EditDeleteCompanyComponent,
        data: {
          title: 'Edit Company',
        },
      },
      {
        path: 'company/delete/:id',
        component: EditDeleteCompanyComponent,
        data: {
          title: 'Delete Company',
        },
      },

      {
        path: 'customers',
        component: CustomerListComponent,
        data: {
          title: 'Customers',
        },
      },
      {
        path: 'customer/add',
        component: AddCustomerComponent,
        data: {
          title: 'Add Customer',
        },
      },
      {
        path: 'customer/details/:id',
        component: CustomerDetailsComponent,
        data: {
          title: 'Customer Details',
        },
      },
      {
        path: 'customer/edit/:id',
        component: EditDeleteCustomerComponent,
        data: {
          title: 'Edit Customer',
        },
      },
      {
        path: 'customer/delete/:id',
        component: EditDeleteCustomerComponent,
        data: {
          title: 'Delete Customer',
        },
      },
      {
        path: 'products',
        component: ProductListComponent,
        data: {
          title: 'Products',
        },
      },
      {
        path: 'product/add',
        component: AddProductComponent,
        data: {
          title: 'Add Product',
        },
      },
      {
        path: 'product/edit/:id',
        component: EditDeleteProductComponent,
        data: {
          title: 'Edit Product',
        },
      },
      {
        path: 'product/delete/:id',
        component: EditDeleteProductComponent,
        data: {
          title: 'Delete Product',
        },
      },
      {
        path: 'product-categories',
        component: ProductCategoryListComponent,
        data: {
          title: 'Product Category',
        },
      },
      {
        path: 'product-category/add',
        component: AddProductCategoryComponent,
        data: {
          title: 'Add Product Category',
        },
      },
      {
        path: 'product-category/edit/:id',
        component: EditDeleteProductCategoryComponent,
        data: {
          title: 'Edit Product Category',
        },
      },
      {
        path: 'product-category/delete/:id',
        component: EditDeleteProductCategoryComponent,
        data: {
          title: 'Delete Product Category',
        },
      },
      {
        path: 'sales-order-status',
        component: SalesOrderStatusListComponent,
        data: {
          title: 'Sales Order Status',
        },
      },
      {
        path: 'sales-order-status/add',
        component: AddSalesOrderStatusComponent,
        data: {
          title: 'Add Sales Order Status',
        },
      },
      {
        path: 'sales-order-status/edit/:id',
        component: EditDeleteSalesOrderStatusComponent,
        data: {
          title: 'Edit Sales Order Status',
        },
      },
      {
        path: 'sales-order-status/delete/:id',
        component: EditDeleteSalesOrderStatusComponent,
        data: {
          title: 'Delete Sales Order Status',
        },
      },
      {
        path: 'floating-labels',
        component: FloatingLabelsComponent,
        data: {
          title: 'Floating Labels',
        },
      },
      {
        path: 'layout',
        component: LayoutComponent,
        data: {
          title: 'Layout',
        },
      },
      {
        path: 'validation',
        component: ValidationComponent,
        data: {
          title: 'Validation',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterDataRoutingModule {}
