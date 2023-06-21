import { CurrencyPipe, formatCurrency } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductCategory } from '@app/_shared/models/master-data/product-category.model';
import { Product } from '@app/_shared/models/master-data/product.model';
import { ProductCategoryService } from '@app/_shared/services/product-category.service';
import { ProductService } from '@app/_shared/services/product.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent {
  addProductForm!: FormGroup;
  submitted = false;
  formErrors: any;
  formControls!: string[];
  messages: string[] = [];
  productCategories: ProductCategory[] = [];
  product!: Product;

  selectedFile!: File;
  // toastr
  toastrColor: string = '';
  position = 'top-end';
  visible = false;

  constructor(
    private formBuilder: FormBuilder,
    public validationFormsService: ValidationFormsService,
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    private router: Router
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
    this.createForm();
    // this.addProductForm.get('valueOnHand')?.disable();
  }

  private _valueOnHand: Object = 0.0;
  private _salesPrice: Object = 0.0;
  private _qtyInStock: Object = 0.0;

  uploadImage(event: any) {
    console.log(event.target.value);
    this.selectedFile = event.target.files[0];
  }

  changePurchasePrice(event: any) {
    const input = parseFloat(event.target.value).toFixed(2);

    this.addProductForm.patchValue({ purchasePrice: input });
  }

  changeQtyInStock(event: any) {
    this._qtyInStock = event.target.value;

    this._valueOnHand = Number(this._salesPrice) * Number(this._qtyInStock);
    const valueOnHand = parseFloat(this._valueOnHand.toString()).toFixed(2);

    const qtyInStock = parseInt(event.target.value);
    this.addProductForm.patchValue({ qtyInStock: qtyInStock });
    this.addProductForm.patchValue({ valueOnHand: valueOnHand });
  }

  changeSalesPrice(event: any) {
    this._salesPrice = event.target.value;

    this._valueOnHand = Number(this._salesPrice) * Number(this._qtyInStock);
    const valueOnHand = parseFloat(this._valueOnHand.toString()).toFixed(2);
    const salesPrice = parseFloat(event.target.value).toFixed(2);
    this.addProductForm.patchValue({ valueOnHand: valueOnHand });
    this.addProductForm.patchValue({ salesPrice: salesPrice });
  }
  onAddImage(event: any) {
    this.selectedFile = <File>event.target.files[0];
    // this.addProductForm.patchValue({ imageFile: this.product.imageFile });
  }

  onReset() {
    this.submitted = false;
    this.addProductForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.addProductForm.status === 'VALID';
    console.log(this.addProductForm);
  }

  onSubmit() {
    console.warn(this.onValidate(), this.addProductForm.value);
    if (this.onValidate()) {
      this.messages = [];
      // TODO: Submit form value
      console.warn(this.addProductForm.value);

      // debugger;
      const frmData: Product = Object.assign(this.addProductForm.value);
      frmData.imageFile = this.selectedFile;

      this.productService.createProduct(frmData).subscribe({
        next: (response: any) => {
          if (response.isSuccess == true || response.statusCode == 201) {
            debugger;
            // alert('SUCCESS!');
            this.router.navigateByUrl('/master-data/products').then(() => {
              debugger;
              this.toastrColor = 'success';
              this.messages.push('Successfully added the Product');
              this.visible = true;
            });
          }
        },
        error: (error: any) => {
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

  createForm() {
    this.addProductForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imageName: [''],
      productCategoryId: ['', [Validators.required]],
      purchasePrice: ['', [Validators.required]],
      salesPrice: ['', [Validators.required]],
      qtyInStock: ['', [Validators.required]],
      valueOnHand: ['', [Validators.required]],
      imageFile: [],
    });
    this.formControls = Object.keys(this.addProductForm.controls);

    this.productCategoryService.getAllProductCategories().subscribe({
      next: (response: any) => {
        this.productCategories = response.result;
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
