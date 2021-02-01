import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsoCustomDialogComponent } from './dso-custom-dialog.component';

describe('DsoCustomDialogComponent', () => {
  let component: DsoCustomDialogComponent;
  let fixture: ComponentFixture<DsoCustomDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsoCustomDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoCustomDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
