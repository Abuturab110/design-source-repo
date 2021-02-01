import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsoLineChartComponent } from './dso-line-chart.component';

describe('DsoLineChartComponent', () => {
  let component: DsoLineChartComponent;
  let fixture: ComponentFixture<DsoLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsoLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
