import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment.development';
import { Company } from '../models/master-data/company.model';
@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private baseUrl: string = 'api/companies';

  constructor(private http: HttpClient, private router: Router) {}

  getAllCompanies(pageSize?: number, pageNumber?: number) {
    if(pageSize != null && pageNumber != null){
      return this.http.get(
        `${environment.appUrl}/${this.baseUrl}?pageSize=`+pageSize + `&pageNumber=` + pageNumber
      );
    }
    return this.http.get( `${environment.appUrl}/${this.baseUrl}` )
  }
  getCompany(id: number) {
    return this.http.get(`${environment.appUrl}/${this.baseUrl}/${id}`);
  }

  createCompany(model: Company) {
    return this.http.post(`${environment.appUrl}/${this.baseUrl}`, model);
  }

  deleteCompany(model: Company) {
    return this.http.delete(
      `${environment.appUrl}/${this.baseUrl}/${model.id}`
    );
  }
  updateCompany(model: Company) {
    return this.http.put(
      `${environment.appUrl}/${this.baseUrl}/${model.id}`,
      model
    );
  }
}
