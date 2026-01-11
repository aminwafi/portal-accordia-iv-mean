import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemEditComponent } from './item-edit';

describe('ItemEdit', () => {
  let component: ItemEditComponent;
  let fixture: ComponentFixture<ItemEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
