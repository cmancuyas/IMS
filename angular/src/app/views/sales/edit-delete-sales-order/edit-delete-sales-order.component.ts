import { devOnlyGuardedExpression } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from '@app/_shared/models/master-data/customer.model';
import { Product } from '@app/_shared/models/master-data/product.model';
import { SalesOrderStatus } from '@app/_shared/models/master-data/sales-order-status.model';
import { SalesOrder } from '@app/_shared/models/master-data/sales-order.model';
import { CustomerService } from '@app/_shared/services/customer.service';
import { ProductService } from '@app/_shared/services/product.service';
import { SalesOrderStatusService } from '@app/_shared/services/sales-order-status.service';
import { SalesOrderService } from '@app/_shared/services/sales-order.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-edit-delete-sales-order',
  templateUrl: './edit-delete-sales-order.component.html',
  styleUrls: ['./edit-delete-sales-order.component.scss'],
})
export class EditDeleteSalesOrderComponent {
  editForm!: FormGroup;
  submitted = false;
  formErrors: any;
  formControls!: string[];
  messages: string[] = [];
  products: Product[] = [];
  customers: Customer[] = [];
  soStatuses: SalesOrderStatus[] = [];
  salesOrderId: number = 0;
  salesOrder!: SalesOrder;
  editPage: boolean = true;
  colorButton: string = '';
  // toastr
  toastrColor: string = '';
  position = 'top-end';
  visible = false;
  _price: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    public validationFormsService: ValidationFormsService,
    private salesOrderService: SalesOrderService,
    private productService: ProductService,
    private customerService: CustomerService,
    private salesOrderStatusService: SalesOrderStatusService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.formErrors = this.validationFormsService.errorMessages;

    this.getPageType();
    this.getSalesOrder();
    this.getProducts();
    this.getCustomers();
    this.getSOStatus();
  }
  getPageType() {
    let title = this.activatedRoute.snapshot.data['title'];
    // debugger;
    if (title == 'Delete Sales Order') {
      this.editPage = false;
      this.colorButton = 'danger';
    } else {
      this.editPage = true;
      this.colorButton = 'success';
    }
  }
  getSalesOrder() {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.salesOrderId = Number(paramMap.get('id'));
      this.salesOrderService.getSalesOrder(this.salesOrderId).subscribe({
        next: (response: any) => {
          this.salesOrder = response.result;
          // debugger;
          this.buildForm();
        },
        error: (error: any) => {
          console.log(error);
        },
        complete() {},
      });
    });
  }
  buildForm() {
    this.editForm = this.formBuilder.group({
      id: [this.salesOrder.id],
      productId: [this.salesOrder.product.id, [Validators.required]],
      customerId: [this.salesOrder.customer.id, [Validators.required]],
      quantity: [this.salesOrder.quantity, [Validators.required]],
      salesOrderStatusId: [
        this.salesOrder.salesOrderStatusId,
        [Validators.required],
      ],
      orderDate: [
        new Date().toISOString().substring(0, 10),
        [Validators.required],
      ],
      subtotal: [
        parseFloat(this.salesOrder.subtotal.toString()),
        [Validators.required],
      ],
      tax: [parseFloat(this.salesOrder.tax.toString()), [Validators.required]],
      total: [
        parseFloat(this.salesOrder.total.toString()),
        [Validators.required],
      ],
    });
    this.formControls = Object.keys(this.editForm.controls);

    //false for delete page
    if (this.editPage == false) {
      this.editForm.get('productId')?.disable();
      this.editForm.get('quantity')?.disable();
      this.editForm.get('orderDate')?.disable();
      this.editForm.get('customerId')?.disable();
      this.editForm.get('salesOrderStatusId')?.disable();
      this.editForm.get('subtotal')?.disable();
      this.editForm.get('tax')?.disable();
      this.editForm.get('total')?.disable();
    }
  }

  onReset() {
    this.submitted = false;
    this.editForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.editForm.status === 'VALID';
    console.log(this.editForm);
  }

  onChangeQty(event: any) {
    // debugger;
    this.getPrice(this.editForm.controls['productId'].value);
    const input = parseFloat(event.target.value).toFixed(2);

    const subtotalNum = Number(input) * Number(this._price);
    // debugger;
    const taxNum = subtotalNum * 0.1;
    const tax = parseFloat(taxNum.toString()).toFixed(2);

    const totalNum = subtotalNum - taxNum;
    const total = parseFloat(totalNum.toString()).toFixed(2);
    this.editForm.patchValue({ subtotal: subtotalNum, tax: tax, total: total });
  }
  onChangeProduct(event: any) {
    // debugger;

    const input = parseFloat(event.target.value);
    this.getSalesQty(input);
    const quantity = this.editForm.get(['quantity'])?.value;
    const subtotalNum = Number(quantity) * Number(this._price);
    // debugger;
    const taxNum = subtotalNum * 0.1;
    const tax = parseFloat(taxNum.toString()).toFixed(2);

    const totalNum = subtotalNum - taxNum;
    const total = parseFloat(totalNum.toString()).toFixed(2);
    this.editForm.patchValue({ subtotal: subtotalNum, tax: tax, total: total });
  }

  getPrice(productId: number): any {
    this.productService.getProduct(productId).subscribe({
      next: async (response: any) => {
        this._price = await response.result.salesPrice;
        // debugger;
        // return response.result.salesPrice;
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
        this.salesOrder.product = response.result;
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
    console.warn(this.onValidate(), this.editForm.value);
    if (this.onValidate()) {
      // TODO: Submit form value
      console.warn(this.editForm.value);

      // debugger;
      if (this.editPage) {
        this.salesOrderService.updateSalesOrder(this.editForm.value).subscribe({
          next: (response: any) => {
            if (response.isSuccess == true || response.statusCode == 201) {
              // alert('SUCCESS!');
              // debugger;
              this.router.navigateByUrl('/sales-order').then(() => {
                // debugger;
                this.toastrColor = 'success';
                this.messages.push('Successfully added the Sales Order');
                this.visible = true;
              });
            }
          },
          error: (error: any) => {
            // debugger;
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
      // Delete Page
      else {
        this.salesOrderService.deleteSalesOrder(this.editForm.value).subscribe({
          next: (response: any) => {
            this.toastrColor = 'success';
            this.messages.push('Successfully deleted the Sales Order');
            this.router.navigateByUrl('/sales-order');
          },
          error: (error: any) => {
            this.toastrColor = 'danger';
            if (error.error.errors) {
              this.messages = error.error.errors;
            } else {
              this.messages.push(error.error);
            }
          },
        });
      }
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
