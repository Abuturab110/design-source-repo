import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DsoStepperComponent } from './dso-stepper.component';


describe('DsoStepperComponent', () => {
  let component: DsoStepperComponent;
  let fixture: ComponentFixture<DsoStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsoStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
