import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeleteSalesOrderStatusComponent } from './edit-delete-sales-order-status.component';

describe('EditDeleteSalesOrderStatusComponent', () => {
  let component: EditDeleteSalesOrderStatusComponent;
  let fixture: ComponentFixture<EditDeleteSalesOrderStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDeleteSalesOrderStatusComponent]
    });
    fixture = TestBed.createComponent(EditDeleteSalesOrderStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
