import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment.development';
import { Product } from '../models/master-data/product.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl: string = 'api/products';

  constructor(private http: HttpClient, private router: Router) {}

  getAllProducts(pageSize?: number, pageNumber?: number): Observable<any> {
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

  getProduct(id: number): Observable<any> {
    return this.http.get(`${environment.appUrl}/${this.baseUrl}/${id}`);
  }

  createProduct(model: Product): Observable<any> {
    let formData = new FormData();

    formData.append('name', model.name);
    formData.append('description', model.description);
    formData.append('imageName', model.imageName);
    formData.append('productCategoryId', model.productCategoryId.toString());
    formData.append('purchasePrice', model.purchasePrice.toString());
    formData.append('salesPrice', model.salesPrice.toString());
    formData.append('qtyInStock', model.qtyInStock.toString());
    formData.append('valueOnHand', model.valueOnHand.toString());
    if (model.imageFile) {
      formData.append('imageFile', model.imageFile ?? '');
    }

    return this.http.post(`${environment.appUrl}/${this.baseUrl}`, formData);
  }

  deleteProduct(model: Product): Observable<any> {
    return this.http.delete(
      `${environment.appUrl}/${this.baseUrl}/${model.id}`
    );
  }
  updateProduct(model: Product): Observable<any> {
    let formData = new FormData();
    formData.append('id', model.id.toString());
    formData.append('name', model.name);
    formData.append('description', model.description);
    if (model.imageName) {
      debugger;
      formData.append('imageName', model.imageName);
    }
    formData.append('productCategoryId', model.productCategoryId.toString());
    formData.append('purchasePrice', model.purchasePrice.toString());
    formData.append('salesPrice', model.salesPrice.toString());
    formData.append('qtyInStock', model.qtyInStock.toString());
    formData.append('valueOnHand', model.valueOnHand.toString());
    if (model.imageFile) {
      formData.append('imageFile', model.imageFile ?? '');
    }

    return this.http.put(
      `${environment.appUrl}/${this.baseUrl}/${model.id}`,
      formData
    );
  }
}
