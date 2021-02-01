import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsoPieChartComponent } from './dso-pie-chart.component';

describe('DsoPieChartComponent', () => {
  let component: DsoPieChartComponent;
  let fixture: ComponentFixture<DsoPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsoPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
