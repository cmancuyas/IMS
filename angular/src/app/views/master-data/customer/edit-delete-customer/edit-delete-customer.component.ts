import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PasswordValidator } from '@app/_shared/helpers/password.validator';
import { Customer } from '@app/_shared/models/master-data/customer.model';
import { CustomerService } from '@app/_shared/services/customer.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';

@Component({
  selector: 'app-edit-delete-customer',
  templateUrl: './edit-delete-customer.component.html',
  styleUrls: ['./edit-delete-customer.component.scss'],
})
export class EditDeleteCustomerComponent implements OnInit {
  editCustomerForm: FormGroup = new FormGroup({});
  submitted = false;
  formErrors: any;
  formControls!: string[];
  customerId: number = 0;
  customer!: Customer;
  errorMessages: string[] = [];
  editPage: boolean = true;
  colorButton: string = '';

  // toastr
  toastrColor: string = '';
  position = 'top-end';
  visible = false;


  constructor(
    private formBuilder: FormBuilder,
    public validationFormsService: ValidationFormsService,
    private customerService: CustomerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.customerId = Number(paramMap.get('id'));
      this.customerService.getCustomer(this.customerId).subscribe({
        next: (response: any) => {
          this.customer = response.result;
          this.buildForm();
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    });

    let title = this.activatedRoute.snapshot.data['title'];
    debugger;
    if (title == 'Delete Customer') {
      this.editPage = false;
      this.colorButton = 'danger';
    } else {
      this.editPage = true;
      this.colorButton = 'success';
    }
  }

  buildForm() {
    this.editCustomerForm = this.formBuilder.group({
      id: [this.customer.id],
      firstName: [this.customer.firstName, [Validators.required]],
      lastName: [this.customer.lastName, [Validators.required]],
      emailAddress: [
        this.customer.emailAddress,
        [Validators.required, Validators.email],
      ],
      phoneNumber: [this.customer.phoneNumber],
      houseNumber: [this.customer.houseNumber],
      street: [this.customer.street],
      brgy: [this.customer.brgy],
      city: [this.customer.city],
      addressLine1: [this.customer.addressLine1, [Validators.required]],
      addressLine2: [this.customer.addressLine2, [Validators.required]],
      postalCode: [this.customer.postalCode],
    });
    this.formControls = Object.keys(this.editCustomerForm.controls);

    //false for delete page
    if (this.editPage == false) {
      this.editCustomerForm.get('firstName')?.disable();
      this.editCustomerForm.get('lastName')?.disable();
      this.editCustomerForm.get('emailAddress')?.disable();
      this.editCustomerForm.get('phoneNumber')?.disable();
      this.editCustomerForm.get('houseNumber')?.disable();
      this.editCustomerForm.get('street')?.disable();
      this.editCustomerForm.get('brgy')?.disable();
      this.editCustomerForm.get('city')?.disable();
      this.editCustomerForm.get('addressLine1')?.disable();
      this.editCustomerForm.get('addressLine2')?.disable();
      this.editCustomerForm.get('postalCode')?.disable();
    }
  }

  onReset() {
    this.submitted = false;
    this.editCustomerForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.editCustomerForm.status === 'VALID';
  }

  onSubmit() {
    // console.warn(this.onValidate(), this.editCustomerForm.value);
    this.submitted = true;
    if (this.onValidate()) {
      // TODO: Submit form value
      console.log(this.editCustomerForm.value);

      if (this.editPage) {
        //Edit page
        this.customerService
          .updateCustomer(this.editCustomerForm.value)
          .subscribe({
            next: (response: any) => {
              this.toastrColor = 'success';
              this.errorMessages.push('Successfully edited the customer');
              this.router.navigateByUrl('/master-data/customers');
            },
            error: (error: any) => {
              this.toastrColor = 'danger';
              if (error.error.errors) {
                this.errorMessages = error.error.errors;
              } else {
                this.errorMessages.push(error.error);
              }
            },
          });
      }

      // Delete Page
      else {
        this.customerService
          .deleteCustomer(this.editCustomerForm.value)
          .subscribe({
            next: (response: any) => {
              this.toastrColor = 'success';
              this.errorMessages.push('Successfully deleted the customer');
              // this.router.navigateByUrl('/master-data/customers');
            },
            error: (error: any) => {
              this.toastrColor = 'danger';
              if (error.error.errors) {
                this.errorMessages = error.error.errors;
              } else {
                this.errorMessages.push(error.error);
              }
            },
          });
      }
    }
  }
}
