import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecAndPrivComponent } from './sec-and-priv.component';

describe('SecAndPrivComponent', () => {
  let component: SecAndPrivComponent;
  let fixture: ComponentFixture<SecAndPrivComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecAndPrivComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecAndPrivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
