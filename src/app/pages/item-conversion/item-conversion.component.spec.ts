import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemConversionComponent } from './item-conversion.component';

describe('ItemConversionComponent', () => {
  let component: ItemConversionComponent;
  let fixture: ComponentFixture<ItemConversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemConversionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
