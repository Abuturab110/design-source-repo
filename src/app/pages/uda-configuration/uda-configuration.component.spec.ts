import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UdaConfigurationComponent } from './uda-configuration.component';


describe('UdaConfigurationComponent', () => {
  let component: UdaConfigurationComponent;
  let fixture: ComponentFixture<UdaConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UdaConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UdaConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
