import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment.development';
import { ProductCategory } from '../models/master-data/product-category.model';
@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  private baseUrl: string = 'api/product-categories';

  constructor(private http: HttpClient, private router: Router) {}

  getAllProductCategories(pageSize?: number, pageNumber?: number) {
    if(pageSize != null && pageNumber != null){
      return this.http.get(
        `${environment.appUrl}/${this.baseUrl}?pageSize=`+pageSize + `&pageNumber=` + pageNumber
      );
    }
    return this.http.get( `${environment.appUrl}/${this.baseUrl}` )
  }

  getProductCategory(id: number) {
    return this.http.get(`${environment.appUrl}/${this.baseUrl}/${id}`);
  }

  createProductCategory(model: ProductCategory) {
    return this.http.post(`${environment.appUrl}/${this.baseUrl}`, model);
  }

  deleteProductCategory(model: ProductCategory) {
    return this.http.delete(
      `${environment.appUrl}/${this.baseUrl}/${model.id}`
    );
  }
  updateProductCategory(model: ProductCategory) {
    return this.http.put(
      `${environment.appUrl}/${this.baseUrl}/${model.id}`,
      model
    );
  }
}
