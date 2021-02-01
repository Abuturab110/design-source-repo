import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DsoAssetCardComponent } from './dso-asset-card.component';

describe('DsoAssetCardComponent', () => {
  let component: DsoAssetCardComponent;
  let fixture: ComponentFixture<DsoAssetCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DsoAssetCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoAssetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
