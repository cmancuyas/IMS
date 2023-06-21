import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderStatusListComponent } from './sales-order-status-list.component';

describe('SalesOrderStatusListComponent', () => {
  let component: SalesOrderStatusListComponent;
  let fixture: ComponentFixture<SalesOrderStatusListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesOrderStatusListComponent]
    });
    fixture = TestBed.createComponent(SalesOrderStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
