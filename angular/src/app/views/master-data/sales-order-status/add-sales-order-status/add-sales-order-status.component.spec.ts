import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesOrderStatusComponent } from './add-sales-order-status.component';

describe('AddSalesOrderStatusComponent', () => {
  let component: AddSalesOrderStatusComponent;
  let fixture: ComponentFixture<AddSalesOrderStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddSalesOrderStatusComponent]
    });
    fixture = TestBed.createComponent(AddSalesOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
