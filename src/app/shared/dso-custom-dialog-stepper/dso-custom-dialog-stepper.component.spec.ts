import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DsoCustomDialogStepperComponent } from './dso-custom-dialog-stepper.component';


describe('DsoCustomDialogStepperComponent', () => {
  let component: DsoCustomDialogStepperComponent;
  let fixture: ComponentFixture<DsoCustomDialogStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsoCustomDialogStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoCustomDialogStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
