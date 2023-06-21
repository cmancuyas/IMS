import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SalesOrderStatus } from '@app/_shared/models/master-data/sales-order-status.model';
import { SalesOrderStatusService } from '@app/_shared/services/sales-order-status.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';
import { environment } from '@environment/environment.development';

@Component({
  selector: 'app-edit-delete-sales-order-status',
  templateUrl: './edit-delete-sales-order-status.component.html',
  styleUrls: ['./edit-delete-sales-order-status.component.scss']
})
export class EditDeleteSalesOrderStatusComponent  implements OnInit {
  imageBaseUrl = environment.appUrl + '/resources/';

  editForm: FormGroup = new FormGroup({});
  submitted = false;
  formErrors: any;
  formControls!: string[];
  salesOrderStatusId: number = 0;
  salesOrderStatus!: SalesOrderStatus;
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
    private salesOrderStatusService: SalesOrderStatusService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.salesOrderStatusId = Number(paramMap.get('id'));
      this.salesOrderStatusService
        .getSalesOrderStatus(this.salesOrderStatusId)
        .subscribe({
          next: (response: any) => {
            this.salesOrderStatus = response.result;
            this.buildForm();
          },
          error: (error: any) => {
            console.log(error);
          },
        });
    });

    let title = this.activatedRoute.snapshot.data['title'];
    debugger;
    if (title == 'Delete Sales Order Status') {
      this.editPage = false;
      this.colorButton = 'danger';
    } else {
      this.editPage = true;
      this.colorButton = 'success';
    }
  }

  buildForm() {
    this.editForm = this.formBuilder.group({
      id: [this.salesOrderStatus.id],
      name: [this.salesOrderStatus.name, [Validators.required]],
    });
    this.formControls = Object.keys(this.editForm.controls);

    //false for delete page
    if (this.editPage == false) {
      this.editForm.get('name')?.disable();
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
  }

  onSubmit() {
    // console.warn(this.onValidate(), this.editForm.value);
    this.submitted = true;
    if (this.onValidate()) {
      // TODO: Submit form value
      console.log(this.editForm.value);

      if (this.editPage) {
        //Edit page
        this.salesOrderStatusService
          .updateSalesOrderStatus(this.editForm.value)
          .subscribe({
            next: (response: any) => {
              debugger;
              this.toastrColor = 'success';
              this.errorMessages.push(
                'Successfully edited the salesOrderStatus'
              );
              this.router.navigateByUrl('/master-data/sales-order-status');
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
        this.salesOrderStatusService
          .deleteSalesOrderStatus(this.editForm.value)
          .subscribe({
            next: (response: any) => {
              this.toastrColor = 'success';
              this.errorMessages.push(
                'Successfully deleted the Sales order status'
              );
              this.router.navigateByUrl('/master-data/sales-order-status');
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
