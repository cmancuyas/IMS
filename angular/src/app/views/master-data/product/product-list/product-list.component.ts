import { Component, OnInit } from '@angular/core';
import { Product} from '@models/master-data/product.model';

import { ProductService } from 'src/app/_shared/services/product.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  pageSize: number = 5;
  pageNumber: number = 1;
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.getAllProducts();
  }
  getAllProducts() {
    // debugger;
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        this.products = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
