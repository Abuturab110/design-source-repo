import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsoCustomDeleteDialogComponent } from './dso-custom-delete-dialog.component';

describe('DsoCustomDeleteDialogComponent', () => {
  let component: DsoCustomDeleteDialogComponent;
  let fixture: ComponentFixture<DsoCustomDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsoCustomDeleteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoCustomDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
