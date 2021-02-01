import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemClassConversionComponent } from './item-class-conversion.component';

describe('ItemClassConversionComponent', () => {
  let component: ItemClassConversionComponent;
  let fixture: ComponentFixture<ItemClassConversionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemClassConversionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemClassConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
