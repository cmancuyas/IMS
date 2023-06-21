import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment.development';
import { SalesOrderStatus } from '../models/master-data/sales-order-status.model';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderStatusService {

  private baseUrl: string = 'api/sales-order-status';

  constructor(private http: HttpClient, private router: Router) {}

  getAllSalesOrderStatus(pageSize?: number, pageNumber?: number) {
    if(pageSize != null && pageNumber != null){
      return this.http.get(
        `${environment.appUrl}/${this.baseUrl}?pageSize=`+pageSize + `&pageNumber=` + pageNumber
      );
    }
    return this.http.get( `${environment.appUrl}/${this.baseUrl}` )
  }

  getSalesOrderStatus(id: number) {
    return this.http.get(`${environment.appUrl}/${this.baseUrl}/${id}`);
  }

  createSalesOrderStatus(model: SalesOrderStatus) {
    return this.http.post(`${environment.appUrl}/${this.baseUrl}`, model);
  }

  deleteSalesOrderStatus(model: SalesOrderStatus) {
    return this.http.delete(
      `${environment.appUrl}/${this.baseUrl}/${model.id}`
    );
  }
  updateSalesOrderStatus(model: SalesOrderStatus) {
    return this.http.put(
      `${environment.appUrl}/${this.baseUrl}/${model.id}`,
      model
    );
  }
}
