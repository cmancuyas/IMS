import { Component, OnInit } from '@angular/core';
import { Product } from '@app/_shared/models/master-data/product.model';
import { SalesOrder } from '@app/_shared/models/master-data/sales-order.model';
import { ProductService } from '@app/_shared/services/product.service';
import { SalesOrderService } from '@app/_shared/services/sales-order.service';
import { Observable } from 'rxjs';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  salesOrders: SalesOrder[] = [];
  pageSize: number = 5;
  pageNumber: number = 1;
  soCount: number = 0;
  totalSales: number = 0;
  totalSalesPaid: number = 0;
  totalSalesNotYetPaid: number = 0;

  products: Product[] = [];
  productCount: number = 0;
  totalProductValue: number = 0;

  constructor(
    private salesOrderService: SalesOrderService,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.getAllSalesOrders();
    this.getProducts();
  }

  async populateSalesVariables() {
    // Get total sales count
    this.soCount = this.salesOrders.length;
    // Get total sales
    this.totalSales = this.salesOrders
      .map((sales) => Number.parseFloat(sales.total.toString()))
      .reduce((acc, curr) => acc + curr, 0);

    // Get total Paid Sales
    this.totalSalesPaid = this.salesOrders
      .filter((sales) => sales.salesOrderStatus.name === 'Paid')
      .map((sales) => Number.parseFloat(sales.total.toString()))
      .reduce((acc, curr) => acc + curr, 0);

    // Get total Paid Sales
    this.totalSalesNotYetPaid = this.salesOrders
      .filter((sales) => sales.salesOrderStatus.name === 'Not yet paid')
      .map((sales) => Number.parseFloat(sales.total.toString()))
      .reduce((acc, curr) => acc + curr, 0);
  }

  async populateProductsVariables() {
    // Get total products
    this.productCount = this.products.length;
    // Get total valueOnHand
    this.totalProductValue = this.products
      .map((product) => Number.parseFloat(product.valueOnHand.toString()))
      .reduce((acc, curr) => acc + curr, 0);
  }

  getAllSalesOrders() {
    this.salesOrderService.getAllSalesOrders().subscribe({
      next: async (response: any) => {
        this.salesOrders = await response.result;
        this.populateSalesVariables();
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  getProducts() {
    this.productService.getAllProducts().subscribe({
      next: async (response: any) => {
        this.products = await response.result;
        this.populateProductsVariables();
      },
      error: (error: any) => {
        console.log(error);
      },
      complete(){

      }
    });
  }
}
