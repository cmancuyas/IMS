import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BranchService } from '@app/_shared/services/branch.service';
import { ValidationFormsService } from '@app/_shared/services/validation-forms.service';
import { PasswordValidator } from '@app/_shared/helpers/password.validator';
import { devOnlyGuardedExpression } from '@angular/compiler';
@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss'],
})
export class AddBranchComponent {
  addBranchForm!: FormGroup;
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
    private branchService: BranchService,
    private router: Router
  ) {
    this.formErrors = this.validationFormsService.errorMessages;
    this.createForm();
  }

  createForm() {
    this.addBranchForm = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
    this.formControls = Object.keys(this.addBranchForm.controls);
  }

  onReset() {
    this.submitted = false;
    this.addBranchForm.reset();
  }

  onValidate() {
    this.submitted = true;

    // stop here if form is invalid
    return this.addBranchForm.status === 'VALID';
    console.log(this.addBranchForm);
  }

  onSubmit() {
    console.warn(this.onValidate(), this.addBranchForm.value);
    if (this.onValidate()) {
      // TODO: Submit form value
      console.warn(this.addBranchForm.value);

      this.branchService.createBranch(this.addBranchForm.value).subscribe({
        next: (response: any) => {
          if (response.isSuccess == true || response.statusCode == 201) {
            // alert('SUCCESS!');
            this.router.navigateByUrl('/master-data/branches').then(() => {
              debugger;
              this.toastrColor = 'success';
              this.messages.push('Successfully added the branch');
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
