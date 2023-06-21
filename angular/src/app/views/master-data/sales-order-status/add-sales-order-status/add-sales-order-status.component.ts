import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SalesOrderStatusService } from '@app/_shared/services/sales-order-status.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';

@Component({
  selector: 'app-add-sales-order-status',
  templateUrl: './add-sales-order-status.component.html',
  styleUrls: ['./add-sales-order-status.component.scss'],
})
export class AddSalesOrderStatusComponent {
  addSalesOrderStatusForm!: FormGroup;
  submitted = false;
  formErrors: any;
  formControls!: string[];
  messages: string[] = [];

  // toastr
  toastrColor: string = '';
  position = 'top-end';
  visible = false;

  constructor(
    private formBuilder: FormBuilder,
    public validationFormsService: ValidationFormsService,
    private salesOrderStatusService: SalesOrderStatusService,
    private router: Router
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
    this.createForm();
  }

  createForm() {
    this.addSalesOrderStatusForm = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
    this.formControls = Object.keys(this.addSalesOrderStatusForm.controls);
  }

  onReset() {
    this.submitted = false;
    this.addSalesOrderStatusForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.addSalesOrderStatusForm.status === 'VALID';
    console.log(this.addSalesOrderStatusForm);
  }

  onSubmit() {
    this.messages = [];
    console.warn(this.onValidate(), this.addSalesOrderStatusForm.value);
    if (this.onValidate()) {
      // TODO: Submit form value
      console.warn(this.addSalesOrderStatusForm.value);
      this.salesOrderStatusService
        .createSalesOrderStatus(this.addSalesOrderStatusForm.value)
        .subscribe({
          next: (response: any) => {
            if (response.isSuccess == true || response.statusCode == 201) {
              // alert('SUCCESS!');
              this.router
                .navigateByUrl('/master-data/sales-order-status')
                .then(() => {
                  this.toastrColor = 'success';
                  this.messages.push('Successfully added the SalesOrderStatus');
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
}
