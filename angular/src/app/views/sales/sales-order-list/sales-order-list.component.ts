import { Component, OnInit } from '@angular/core';
import { SalesOrderService } from '@app/_shared/services/sales-order.service';
import { SalesOrder } from '@models/master-data/sales-order.model';
@Component({
  selector: 'app-sales-order-list',
  templateUrl: './sales-order-list.component.html',
  styleUrls: ['./sales-order-list.component.scss'],
})
export class SalesOrderListComponent implements OnInit {
  salesOrders: SalesOrder[] = [];
  pageSize: number = 5;
  pageNumber: number = 1;
  constructor(
    private salesOrderService: SalesOrderService,
  ) {}
  ngOnInit(): void {
    this.getAllSalesOrders();
  }
  getAllSalesOrders() {
    this.salesOrderService.getAllSalesOrders().subscribe({
      next: async (response: any) => {
        this.salesOrders = await response.result;

      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
