import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Branch } from '@app/_shared/models/master-data/branch.model';
import { BranchService } from '@app/_shared/services/branch.service';
import { Observable, map } from 'rxjs';
@Component({
  selector: 'app-edit-branch',
  templateUrl: './edit-branch.component.html',
  styleUrls: ['./edit-branch.component.scss'],
})
export class EditBranchComponent implements OnInit {
  editBranchForm: FormGroup = new FormGroup({});
  customStylesValidated = '';
  submitted = false;
  errorMessages: string[] = [];
  toastrColor: string = '';
  branchId: number | null = null;
  branchName: string = '';
  state$!: Observable<object>;
  branch!: Branch;
  editPage: boolean = true;
  colorButton: string = '';
  isDisabled = false;

  constructor(
    private formBuilder: FormBuilder,
    private branchService: BranchService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.initializeForm();

    // debugger;
    let title = this.activatedRoute.snapshot.data['title'];
    if (title == 'Delete Branch') {
      this.editPage = false;
      this.colorButton = 'danger';
    } else {
      this.editPage = true;
      this.colorButton = 'success';
    }

    this.activatedRoute.paramMap.subscribe((paramMap) => {
      this.branchId = Number(paramMap.get('id'));
      this.branchService.getBranch(this.branchId).subscribe({
        next: (response: any) => {
          this.branch = response.result;
          this.branchName = this.branch.name;
          this.buildForm();
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    });
  }

  initializeForm() {
    this.editBranchForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  buildForm() {
    this.editBranchForm = this.formBuilder.group({
      id: [this.branch.id],
      name: [this.branch.name],
    });

    //false for delete page
    if (this.editPage == false) {
      this.editBranchForm.get('name')?.disable();
    }
  }

  onReset() {}
  onSubmit(): void {
    this.submitted = true;
    // debugger;
    if (this.editBranchForm.valid) {
      // Edit
      if (this.editPage == true) {
        this.branchService.updateBranch(this.editBranchForm.value).subscribe({
          next: (response: any) => {
            this.toastrColor = 'success';
            this.errorMessages.push('Successfully edited the branch');
            this.router.navigateByUrl('/master-data/branches');
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
      } else {
        // Delete
        this.branchService.deleteBranch(this.editBranchForm.value).subscribe({
          next: (response: any) => {
            this.toastrColor = 'success';
            this.errorMessages.push('Successfully deleted the branch');
            this.router.navigateByUrl('/master-data/branches');
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

  // toastr
  position = 'top-end';
  visible = false;
  percentage = 0;

  toggleToast() {
    this.visible = !this.visible;
  }

  onVisibleChange($event: boolean) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  onTimerChange($event: number) {
    this.percentage = $event * 25;
  }
}
