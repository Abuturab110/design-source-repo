import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsoUploadDialogComponent } from './dso-upload-dialog.component';

describe('DsoUploadDialogComponent', () => {
  let component: DsoUploadDialogComponent;
  let fixture: ComponentFixture<DsoUploadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsoUploadDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
