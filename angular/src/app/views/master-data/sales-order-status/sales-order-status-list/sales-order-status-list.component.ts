import { Component } from '@angular/core';
import { SalesOrderStatus } from '@models/master-data/sales-order-status.model';
import { SalesOrderStatusService } from 'src/app/_shared/services/sales-order-status.service';

@Component({
  selector: 'app-sales-order-status-list',
  templateUrl: './sales-order-status-list.component.html',
  styleUrls: ['./sales-order-status-list.component.scss'],
})
export class SalesOrderStatusListComponent {
  salesOrderStatus: SalesOrderStatus[] = [];
  pageSize: number = 5;
  pageNumber: number = 1;
  constructor(private salesOrderStatusService: SalesOrderStatusService) {}
  ngOnInit(): void {
    this.getAllSalesOrderStatus();
  }

  getAllSalesOrderStatus() {
    this.salesOrderStatusService.getAllSalesOrderStatus().subscribe({
      next: (response: any) => {
        this.salesOrderStatus = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
