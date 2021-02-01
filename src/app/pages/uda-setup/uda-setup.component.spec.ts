import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UdaSetupComponent } from './uda-setup.component';

describe('UdaSetupComponent', () => {
  let component: UdaSetupComponent;
  let fixture: ComponentFixture<UdaSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UdaSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UdaSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
