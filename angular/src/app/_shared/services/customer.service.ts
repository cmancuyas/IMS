import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment.development';
import { Customer } from '../models/master-data/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl: string = 'api/customers';

  constructor(private http: HttpClient, private router: Router) {}

  getAllCustomers() {
    return this.http.get(`${environment.appUrl}/${this.baseUrl}`);
  }

  getCustomer(id: number) {
    return this.http.get(
      `${environment.appUrl}/${this.baseUrl}/${id}`
    );
  }

  createCustomer(model: Customer) {
    return this.http.post(
      `${environment.appUrl}/${this.baseUrl}`, model
    );
  }

  deleteCustomer(model: Customer) {
    return this.http.delete(
      `${environment.appUrl}/${this.baseUrl}/${model.id}`
    );
  }
  updateCustomer(model: Customer) {
    return this.http.put(
      `${environment.appUrl}/${this.baseUrl}/${model.id}`, model
    );
  }
}
