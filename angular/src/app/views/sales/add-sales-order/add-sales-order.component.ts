import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';
import { SalesOrderService } from 'src/app/_shared/services/sales-order.service';
import { ProductService } from '@app/_shared/services/product.service';
import { Product } from '@app/_shared/models/master-data/product.model';
import { CustomerService } from '@app/_shared/services/customer.service';
import { SalesOrderStatusService } from '@app/_shared/services/sales-order-status.service';
import { Customer } from '@app/_shared/models/master-data/customer.model';
import { SalesOrderStatus } from '@app/_shared/models/master-data/sales-order-status.model';
@Component({
  selector: 'app-add-sales-order',
  templateUrl: './add-sales-order.component.html',
  styleUrls: ['./add-sales-order.component.scss'],
})
export class AddSalesOrderComponent {
  addForm!: FormGroup;
  submitted = false;
  formErrors: any;
  formControls!: string[];
  messages: string[] = [];
  products: Product[] = [];
  customers: Customer[] = [];
  soStatuses: SalesOrderStatus[] = [];
  // toastr
  toastrColor: string = '';
  position = 'top-end';
  visible = false;

  constructor(
    private formBuilder: FormBuilder,
    public validationFormsService: ValidationFormsService,
    private salesOrderService: SalesOrderService,
    private productService: ProductService,
    private customerService: CustomerService,
    private salesOrderStatusService: SalesOrderStatusService,
    private router: Router
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
    this.buildForm();
    this.getProducts();
    this.getCustomers();
    this.getSOStatus();
  }

  buildForm() {
    this.addForm = this.formBuilder.group({
      productId: ['', [Validators.required]],
      customerId: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      salesOrderStatusId: ['', [Validators.required]],
      orderDate: [
        new Date().toISOString().substring(0, 10),
        [Validators.required],
      ],
      subtotal: ['', [Validators.required]],
      tax: ['', [Validators.required]],
      total: ['', [Validators.required]],
    });
    this.formControls = Object.keys(this.addForm.controls);
  }

  onReset() {
    this.submitted = false;
    this.addForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.addForm.status === 'VALID';
    console.log(this.addForm);
  }
  _price: number = 0;
  onChangeQty(event: any) {
    this.getPrice(this.addForm.controls['productId'].value);
    const input = parseFloat(event.target.value).toFixed(2);

    const subtotalNum = Number(input) * Number(this._price);
    // debugger;
    const taxNum = subtotalNum * 0.1;
    const tax = parseFloat(taxNum.toString()).toFixed(2);

    const totalNum = subtotalNum - taxNum;
    const total = parseFloat(totalNum.toString()).toFixed(2);
    this.addForm.patchValue({ subtotal: subtotalNum, tax: tax, total: total });
  }
  onChangeProduct(event: any) {
    debugger;
    this.getSalesQty(this.addForm.controls['productId'].value);
    const input = parseFloat(event.target.value).toFixed(2);

    const subtotalNum = Number(input) * Number(this._price);
    // debugger;
    const taxNum = subtotalNum * 0.1;
    const tax = parseFloat(taxNum.toString()).toFixed(2);

    const totalNum = subtotalNum - taxNum;
    const total = parseFloat(totalNum.toString()).toFixed(2);
    this.addForm.patchValue({ subtotal: subtotalNum, tax: tax, total: total });
  }

  getPrice(productId: number): any {
    this.productService.getProduct(productId).subscribe({
      next: (response: any) => {
        this._price = response.result.salesPrice;

        return response.result.salesPrice;
      },
      error: (error: any) => {
        if (error.error.CustomError) {
          this.messages.push(error.error.CustomError);
        } else {
          if (error.error.errors) {
            this.messages = error.error.errors;
          } else {
            this.messages.push(error.error);
          }
        }
      },
      complete() {},
    });
  }
  getSalesQty(productId: number): any {
    this.productService.getProduct(productId).subscribe({
      next: (response: any) => {
        this._price = response.result.salesQty;

        return response.result.salesPrice;
      },
      error: (error: any) => {
        if (error.error.CustomError) {
          this.messages.push(error.error.CustomError);
        } else {
          if (error.error.errors) {
            this.messages = error.error.errors;
          } else {
            this.messages.push(error.error);
          }
        }
      },
      complete() {},
    });
  }
  onChangeOrderDate(event: any) {}
  onChangeSubtotal(event: any) {}
  onChangeTax(event: any) {}
  onChangeTotal(event: any) {}
  onSubmit() {
    this.messages = [];
    console.warn(this.onValidate(), this.addForm.value);
    if (this.onValidate()) {
      // TODO: Submit form value
      console.warn(this.addForm.value);
      debugger;
      this.salesOrderService.createSalesOrder(this.addForm.value).subscribe({
        next: (response: any) => {
          if (response.isSuccess == true || response.statusCode == 201) {
            // alert('SUCCESS!');
            this.router.navigateByUrl('/sales-order').then(() => {
              debugger;
              this.toastrColor = 'success';
              this.messages.push('Successfully added the salesOrder');
              this.visible = true;
            });
          }
        },
        error: (error: any) => {
          debugger;
          this.toastrColor = 'danger';
          this.visible = true;
          if (error.error.CustomError) {
            this.messages.push(error.error.CustomError);
          } else {
            if (error.error.errors) {
              this.messages = error.error.errors;
            } else {
              this.messages.push(error.error);
            }
          }
        },
      });
    }
  }

  getProducts() {
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        this.products = response.result;
      },
      error: (error: any) => {
        if (error.error.CustomError) {
          this.messages.push(error.error.CustomError);
        } else {
          if (error.error.errors) {
            this.messages = error.error.errors;
          } else {
            this.messages.push(error.error);
          }
        }
      },
    });
  }
  getCustomers() {
    this.customerService.getAllCustomers().subscribe({
      next: (response: any) => {
        this.customers = response.result;
      },
      error: (error: any) => {
        if (error.error.CustomError) {
          this.messages.push(error.error.CustomError);
        } else {
          if (error.error.errors) {
            this.messages = error.error.errors;
          } else {
            this.messages.push(error.error);
          }
        }
      },
    });
  }
  getSOStatus() {
    this.salesOrderStatusService.getAllSalesOrderStatus().subscribe({
      next: (response: any) => {
        this.soStatuses = response.result;
      },
      error: (error: any) => {
        if (error.error.CustomError) {
          this.messages.push(error.error.CustomError);
        } else {
          if (error.error.errors) {
            this.messages = error.error.errors;
          } else {
            this.messages.push(error.error);
          }
        }
      },
    });
  }
}
