import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment.development';

import { Branch } from '../models/master-data/branch.model';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private baseUrl: string = 'api/branches';

  constructor(private http: HttpClient, private router: Router) {}

  getAllBranches(pageSize?: number, pageNumber?: number) {
    if(pageSize != null && pageNumber != null){
      return this.http.get(
        `${environment.appUrl}/${this.baseUrl}?pageSize=`+pageSize + `&pageNumber=` + pageNumber
      );
    }
    return this.http.get( `${environment.appUrl}/${this.baseUrl}` )
  }

  getBranch(id: number) {
    return this.http.get(`${environment.appUrl}/${this.baseUrl}/${id}`);
  }

  createBranch(model: Branch) {
    return this.http.post(`${environment.appUrl}/${this.baseUrl}`, model);
  }

  deleteBranch(model: Branch) {
    return this.http.delete(
      `${environment.appUrl}/${this.baseUrl}/${model.id}`
    );
  }
  updateBranch(model: Branch) {
    return this.http.put(
      `${environment.appUrl}/${this.baseUrl}/${model.id}`,
      model
    );
  }
}
