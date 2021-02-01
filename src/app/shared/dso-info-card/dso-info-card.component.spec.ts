import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsoInfoCardComponent } from './dso-info-card.component';

describe('DsoInfoCardComponent', () => {
  let component: DsoInfoCardComponent;
  let fixture: ComponentFixture<DsoInfoCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsoInfoCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
