import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment.development';
import { SalesOrder } from '../models/master-data/sales-order.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SalesOrderService {
  private baseUrl: string = 'api/sales-orders';

  constructor(private http: HttpClient, private router: Router) {}

  getAllSalesOrders(pageSize?: number, pageNumber?: number):Observable<any> {
    if (pageSize != null && pageNumber != null) {
      return this.http.get(
        `${environment.appUrl}/${this.baseUrl}?pageSize=` +
          pageSize +
          `&pageNumber=` +
          pageNumber
      );
    }
    return this.http.get(`${environment.appUrl}/${this.baseUrl}`);
  }

  getSalesOrder(id: number):Observable<any> {
    return this.http.get(`${environment.appUrl}/${this.baseUrl}/${id}`);
  }

  createSalesOrder(model: SalesOrder):Observable<any>  {
    return this.http.post(`${environment.appUrl}/${this.baseUrl}`, model);
  }

  deleteSalesOrder(model: SalesOrder):Observable<any>  {
    return this.http.delete(
      `${environment.appUrl}/${this.baseUrl}/${model.id}`
    );
  }
  updateSalesOrder(model: SalesOrder):Observable<any>  {
    return this.http.put(
      `${environment.appUrl}/${this.baseUrl}/${model.id}`,
      model
    );
  }
}
