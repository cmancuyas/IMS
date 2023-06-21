import { Component, OnInit } from '@angular/core';
import { Branch } from '@models/master-data/branch.model';

import { BranchService } from 'src/app/_shared/services/branch.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.scss'],
})
export class BranchListComponent implements OnInit {
  branches: Branch[] = [];
  pageSize: number = 5;
  pageNumber: number = 1;
  constructor(private branchService: BranchService) {}
  ngOnInit(): void {
    this.getAllBranches();
  }

  getAllBranches() {
    this.branchService.getAllBranches().subscribe({
      next: (response: any) => {
        this.branches = response.result;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
